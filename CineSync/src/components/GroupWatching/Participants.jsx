import { useRef, useState, useEffect } from "react";
import { socket } from "../Home/socket";

export default function Participants({
  roomName,
  username,
  localVideo
}) {

  const peersRef = useRef({});
  const localStream = useRef(null);
  const iceQueue = useRef({});
  const [remoteStreams, setRemoteStreams] = useState([]);

  const pcConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject"
      }
    ]
  };

  /* ================= START ================= */

  useEffect(() => {
    start();

    return () => {
      Object.values(peersRef.current).forEach(pc => pc.close());

      socket.off("all-users");
      socket.off("newJoin");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-disconnected");
    };
  }, []);

  async function start() {

    localStream.current =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

    localVideo.current.srcObject = localStream.current;

    socket.emit("joinRoom", roomName, username);

    /* EXISTING USERS */
    socket.on("all-users", users => {
      users.forEach(user => {
        createPeer(user.id, true);
      });
    });

    /* NEW USER */
    socket.on("newJoin", user => {
      createPeer(user.id, false);
    });

    /* OFFER */
    socket.on("offer", async data => {

      let pc = peersRef.current[data.from];
      if (!pc) pc = createPeer(data.from, false);

      await pc.setRemoteDescription(data.offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", {
        to: data.from,
        answer
      });
    });

    /* ANSWER */
    socket.on("answer", async data => {
      const pc = peersRef.current[data.from];
      if (!pc) return;

      await pc.setRemoteDescription(data.answer);
    });

    /* ICE */
    socket.on("ice-candidate", async data => {
      const pc = peersRef.current[data.from];
      if (!pc) return;

      await pc.addIceCandidate(data.candidate);
    });

    socket.on("user-disconnected", id => {
      if (peersRef.current[id]) {
        peersRef.current[id].close();
        delete peersRef.current[id];
      }

      setRemoteStreams(prev =>
        prev.filter(s => s.id !== id)
      );
    });
  }

  /* ================= CREATE PEER ================= */

  function createPeer(id, initiator) {

    const pc = new RTCPeerConnection(pcConfig);

    peersRef.current[id] = pc;

    localStream.current.getTracks().forEach(track =>
      pc.addTrack(track, localStream.current)
    );

    pc.ontrack = e => {
      setRemoteStreams(prev => {
        if (prev.find(p => p.id === id)) return prev;
        return [...prev, { id, stream: e.streams[0] }];
      });
    };

    pc.onicecandidate = e => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          to: id,
          candidate: e.candidate
        });
      }
    };

    if (initiator) {
      pc.onnegotiationneeded = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("offer", {
          to: id,
          offer
        });
      };
    }

    return pc;
  }

  /* ================= UI ================= */

  return (
    <div>
      {remoteStreams.map(user => (
        <video
          key={user.id}
          autoPlay
          playsInline
          ref={ref => {
            if (ref) ref.srcObject = user.stream;
          }}
        />
      ))}
    </div>
  );
}