import { useRef, useEffect } from "react";
import { socket } from "../Home/socket";

export default function Participants({ roomName, username }) {

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  /* ===============================
     GET CAMERA + MIC
  =============================== */

  useEffect(() => {
    startMedia();
  }, []);

  const startMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideoRef.current.srcObject = stream;

    createPeer(stream);
    startCall();
  };

  /* ===============================
     CREATE PEER CONNECTION
  =============================== */

  const createPeer = (stream) => {

    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });

    // send tracks
    stream.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, stream);
    });

    // receive remote video
    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // ICE candidate
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc-ice-candidate", {
          room: roomName,
          candidate: event.candidate,
        });
      }
    };
  };

  /* ===============================
     START CALL
  =============================== */

  const startCall = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("webrtc-offer", {
      room: roomName,
      offer,
      sender: username,
    });
  };

  /* ===============================
     SOCKET LISTENERS
  =============================== */

  useEffect(() => {

    socket.on("webrtc-offer", async ({ offer }) => {

      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("webrtc-answer", {
        room: roomName,
        answer,
      });
    });

    socket.on("webrtc-answer", async (answer) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("webrtc-ice-candidate", async (candidate) => {
      try {
        await peerConnection.current.addIceCandidate(candidate);
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("webrtc-ice-candidate");
    };

  }, []);

  /* ===============================
     UI
  =============================== */

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      
      <div>
        <h3>My Video</h3>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          width="300"
        />
      </div>

      <div>
        <h3>Friend Video</h3>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          width="300"
        />
      </div>

    </div>
  );
}