import { useRef, useEffect, useState } from "react";
import { socket } from "../Home/socket";

export default function Participants({ roomName, username }) {

  const localVideoRef = useRef(null);
  const localStream = useRef(null);

  // store peer connections
  const peers = useRef({});

  // UI streams
  const [remoteStreams, setRemoteStreams] = useState({});

  /* =====================================
     START CAMERA
  ===================================== */

  useEffect(() => {
    startMedia();
  }, []);

  const startMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStream.current = stream;
    localVideoRef.current.srcObject = stream;

    socket.emit("joinRoom", roomName, username);
  };

  /* =====================================
     CREATE PEER CONNECTION
  ===================================== */

  const createPeerConnection = (targetUser) => {

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // add tracks
    localStream.current.getTracks().forEach(track => {
      pc.addTrack(track, localStream.current);
    });

    // receive stream
    pc.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [targetUser]: event.streams[0],
      }));
    };

    // ice candidate
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
     WHEN NEW USER JOINS
  ===================================== */

  useEffect(() => {

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
      await peers.current[sender].setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    /* ---------- ICE ---------- */

    socket.on("webrtc-ice-candidate", async ({ candidate, sender }) => {
      try {
        await peers.current[sender].addIceCandidate(candidate);
      } catch (e) {
        console.error(e);
      }
    });

    return () => {
      socket.off("newJoin");
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("webrtc-ice-candidate");
    };

  }, []);

  /* =====================================
     UI
  ===================================== */

  return (
    <div>

      <h2>Participants</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>

        {/* Local video */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          width="250"
        />

        {/* Remote users */}
        {Object.entries(remoteStreams).map(([user, stream]) => (
          <video
            key={user}
            autoPlay
            playsInline
            width="250"
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
          />
        ))}

      </div>
    </div>
  );
}