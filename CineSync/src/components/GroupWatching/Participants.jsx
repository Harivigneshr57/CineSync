import { useRef, useEffect, useState } from "react";
import { socket } from "../Home/socket";

export default function Participants({ roomName, username }) {

  const localVideoRef = useRef(null);
  const localStream = useRef(null);

  // username -> RTCPeerConnection
  const peers = useRef({});

  // username -> MediaStream
  const [remoteStreams, setRemoteStreams] = useState({});

  /* =====================================
     START CAMERA + JOIN ROOM
  ===================================== */

  useEffect(() => {
    startMedia();
  }, []);

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStream.current = stream;
      localVideoRef.current.srcObject = stream;

      // register user (IMPORTANT)
      socket.emit("addtoserver", username);

      // join watch party room
      socket.emit("joinRoom", roomName, username);

    } catch (err) {
      console.error("Media error:", err);
    }
  };

  /* =====================================
     CREATE PEER CONNECTION
  ===================================== */

  const createPeerConnection = (targetUser) => {

    // prevent duplicate connection
    if (peers.current[targetUser]) return peers.current[targetUser];

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });

    // send local tracks
    localStream.current.getTracks().forEach(track => {
      pc.addTrack(track, localStream.current);
    });

    // receive remote stream
    pc.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [targetUser]: event.streams[0],
      }));
    };

    // ICE candidate
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc-ice-candidate", {
          target: targetUser,
          candidate: event.candidate,
          sender: username,
        });
      }
    };

    peers.current[targetUser] = pc;
    return pc;
  };

  /* =====================================
     SOCKET EVENTS
  ===================================== */

  useEffect(() => {

    /* ---------- EXISTING USERS ---------- */
    socket.on("existingUsers", async (usersInRoom) => {

      console.log("Existing users:", usersInRoom);

      for (const user of usersInRoom) {

        if (user === username) continue;

        const pc = createPeerConnection(user);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("webrtc-offer", {
          target: user,
          offer,
          sender: username,
        });
      }
    });

    /* ---------- NEW USER JOINED ---------- */
    socket.on("newJoin", async (newUser) => {

      if (newUser === username) return;

      const pc = createPeerConnection(newUser);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("webrtc-offer", {
        target: newUser,
        offer,
        sender: username,
      });
    });

    /* ---------- RECEIVE OFFER ---------- */
    socket.on("webrtc-offer", async ({ offer, sender }) => {

      const pc = createPeerConnection(sender);

      await pc.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc-answer", {
        target: sender,
        answer,
        sender: username,
      });
    });

    /* ---------- RECEIVE ANSWER ---------- */
    socket.on("webrtc-answer", async ({ answer, sender }) => {

      const pc = peers.current[sender];
      if (!pc) return;

      await pc.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    /* ---------- ICE ---------- */
    socket.on("webrtc-ice-candidate", async ({ candidate, sender }) => {

      const pc = peers.current[sender];
      if (!pc) return;

      try {
        await pc.addIceCandidate(candidate);
      } catch (err) {
        console.error("ICE error:", err);
      }
    });

    /* ---------- USER LEFT ---------- */
    socket.on("userLeft", (user) => {

      if (peers.current[user]) {
        peers.current[user].close();
        delete peers.current[user];
      }

      setRemoteStreams(prev => {
        const copy = { ...prev };
        delete copy[user];
        return copy;
      });
    });

    return () => {
      socket.off("existingUsers");
      socket.off("newJoin");
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("webrtc-ice-candidate");
      socket.off("userLeft");
    };

  }, [username]);

  /* =====================================
     UI
  ===================================== */

  return (
    <div>

      <h2>Participants</h2>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 20
      }}>

        {/* LOCAL VIDEO */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          width="250"
        />

        {/* REMOTE VIDEOS */}
        {Object.entries(remoteStreams).map(([user, stream]) => (
          <video
            key={user}
            autoPlay
            playsInline
            width="250"
            ref={(video) => {
              if (video && stream) {
                video.srcObject = stream;
              }
            }}
          />
        ))}

      </div>
    </div>
  );
}