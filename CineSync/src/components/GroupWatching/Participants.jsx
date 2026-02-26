import { useRef, useEffect, useState } from "react";
import { socket } from "../Home/socket";
const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
};
export default function Participants({ party, localVideo }) {
  const [participants, setParticipants] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState({});

  const roomName = localStorage.getItem("Roomname");
  const username = localStorage.getItem("Username");

  const localVideoRef = useRef(null);
  const peerConnections = useRef({});
  const localStreamRef = useRef(null);

  const getPeerConnection = (remoteUser) => {
    if (peerConnections.current[remoteUser]) {
      return peerConnections.current[remoteUser];
    }

    const peerConnection = new RTCPeerConnection(rtcConfig);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current);
      });
    }

    peerConnection.onicecandidate = (event) => {
      if (!event.candidate) return;

      socket.emit("webrtcIceCandidate", {
        to: remoteUser,
        from: username,
        candidate: event.candidate
      });
    };

    peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      if (!stream) return;

      setRemoteStreams((prev) => ({
        ...prev,
        [remoteUser]: stream
      }));
    };

    peerConnections.current[remoteUser] = peerConnection;

    return peerConnection;
  };

  const createOfferFor = async (remoteUser) => {
    const pc = getPeerConnection(remoteUser);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("webrtcOffer", {
      to: remoteUser,
      from: username,
      offer
    });
  };

  useEffect(() => {
    socket.emit("joinRoom", roomName, username);
    socket.emit("requestRoomUsers", roomName);

    const handleRoomUsers = (members) => {
      const orderedMembers = members || [];
      setParticipants(orderedMembers);

      orderedMembers
        .filter((member) => member !== username)
        .forEach((member) => {
          const shouldCreateOffer = username < member;
          if (shouldCreateOffer && !peerConnections.current[member]) {
            createOfferFor(member).catch(console.error);
          }
        });

      Object.keys(peerConnections.current).forEach((member) => {
        if (!orderedMembers.includes(member)) {
          peerConnections.current[member].close();
          delete peerConnections.current[member];

          setRemoteStreams((prev) => {
            const next = { ...prev };
            delete next[member];
            return next;
          });
        }
      });
    };

    const handleOffer = async ({ from, offer }) => {
      const pc = getPeerConnection(from);

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtcAnswer", {
        to: from,
        from: username,
        answer
      });
    };

    const handleAnswer = async ({ from, answer }) => {
      const pc = peerConnections.current[from];
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIceCandidate = async ({ from, candidate }) => {
      const pc = peerConnections.current[from];
      if (!pc || !candidate) return;

      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    };

    socket.on("roomUsersUpdated", handleRoomUsers);
    socket.on("webrtcOffer", handleOffer);
    socket.on("webrtcAnswer", handleAnswer);
    socket.on("webrtcIceCandidate", handleIceCandidate);

    return () => {
      socket.emit("leaveRoom", username, roomName);
      socket.off("roomUsersUpdated", handleRoomUsers);
      socket.off("webrtcOffer", handleOffer);
      socket.off("webrtcAnswer", handleAnswer);
      socket.off("webrtcIceCandidate", handleIceCandidate);

      Object.values(peerConnections.current).forEach((pc) => pc.close());
      peerConnections.current = {};
    };
  }, [roomName, username]);

  useEffect(() => {
    const startLocalMedia = async () => {
      if (localStreamRef.current) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      if (localVideo?.current) {
        localVideo.current.srcObject = stream;
      }
    };

    startLocalMedia().catch(console.error);

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    };
  }, [localVideo]);

  useEffect(() => {
    Object.entries(remoteStreams).forEach(([member, stream]) => {
      const element = document.getElementById(`remote-video-${member}`);
      if (element && element.srcObject !== stream) {
        element.srcObject = stream;
      }
    });
  }, [remoteStreams]);

  if (!party) {
    return null;
  }

  return (
    <div className="roomParticipants">
      <div className="participantsHead">Participants ({participants.length})</div>
      <div className="participantsBody">
        <div className="participantCard">
          <video ref={localVideoRef} autoPlay muted playsInline />
          <p>{username} (You)</p>
        </div>

        {participants
          .filter((member) => member !== username)
          .map((member) => (
            <div className="participantCard" key={member}>
              <video id={`remote-video-${member}`} autoPlay playsInline />
              <p>{member}</p>
            </div>
          ))}
      </div>
    </div>
  );
}