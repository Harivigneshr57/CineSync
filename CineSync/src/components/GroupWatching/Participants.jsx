import React, { useEffect, useRef, useState } from "react";
import { socket } from "../Home/socket";

const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
};

export default function Participants({ roomName, username }) {

  const localVideoRef = useRef(null);
  const localStream = useRef(null);

  const peers = useRef({});
  const [remoteStreams, setRemoteStreams] = useState({});

  /* ===============================
      START CAMERA + MIC
  =============================== */
  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStream.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      socket.emit("joinRoom", roomName, username);

    } catch (err) {
      console.log("Media error:", err);
    }
  };

  /* ===============================
        CREATE PEER
  =============================== */
  const createPeer = (targetUser) => {

    const peer = new RTCPeerConnection(iceServers);

    localStream.current.getTracks().forEach(track => {
      peer.addTrack(track, localStream.current);
    });

    peer.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [targetUser]: event.streams[0]
      }));
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          candidate: event.candidate,
          to: targetUser
        });
      }
    };

    peers.current[targetUser] = peer;
    return peer;
  };

  /* ===============================
        SOCKET EVENTS
  =============================== */
  useEffect(() => {

    startMedia();

    // new user joined
    socket.on("newJoin", async (newUser) => {

      const peer = createPeer(newUser);

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("offer", {
        offer,
        to: newUser,
        from: username
      });
    });

    // receive offer
    socket.on("offer", async ({ offer, from }) => {

      const peer = createPeer(from);

      await peer.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("answer", {
        answer,
        to: from
      });
    });

    // receive answer
    socket.on("answer", async ({ answer, from }) => {
      const peer = peers.current[from];
      if (peer) {
        await peer.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    // ICE candidate
    socket.on("iceCandidate", async ({ candidate, from }) => {
      const peer = peers.current[from];
      if (peer) {
        await peer.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });

    return () => {
      socket.off("newJoin");
      socket.off("offer");
      socket.off("answer");
      socket.off("iceCandidate");
    };

  }, []);

  /* ===============================
            UI
  =============================== */
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

      {/* LOCAL VIDEO */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "250px",
          borderRadius: "10px",
          background: "black"
        }}
      />

      {/* REMOTE USERS */}
      {Object.entries(remoteStreams).map(([user, stream]) => (
        <Video key={user} stream={stream} />
      ))}

    </div>
  );
}


/* ===============================
      REMOTE VIDEO COMPONENT
================================= */

function Video({ stream }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      style={{
        width: "250px",
        borderRadius: "10px",
        background: "black"
      }}
    />
  );
}