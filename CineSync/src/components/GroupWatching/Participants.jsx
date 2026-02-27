import { useEffect, useRef, useState } from "react";
import { socket } from "../Home/socket";
const optionalTurnServer =
  import.meta.env.VITE_TURN_URL &&
  import.meta.env.VITE_TURN_USERNAME &&
  import.meta.env.VITE_TURN_CREDENTIAL
    ? {
        urls: import.meta.env.VITE_TURN_URL,
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL
      }
    : null;

    const fallbackTurnServer = {
      urls: [
        "turn:openrelay.metered.ca:80",
        "turn:openrelay.metered.ca:443",
        "turn:openrelay.metered.ca:443?transport=tcp"
      ],
      username: "openrelayproject",
      credential: "openrelayproject"
    };

const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    ...(optionalTurnServer ? [optionalTurnServer] : [fallbackTurnServer])
  ]
};
export default function Participants({ party, localVideo, mutedUsers, setMutedUsers, micOn }) {
  const [participants, setParticipants] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState({});

  const roomName = localStorage.getItem("Roomname");
  const username = localStorage.getItem("Username");

  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const peerConnections = useRef({});
  const localStreamRef = useRef(null);
  const pendingIceCandidates = useRef({});

  function toggleRemoteMute(member) {
    setMutedUsers((prev) => ({
      ...prev,
      [member]: !prev[member]
    }));
  }
  
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

    peerConnection.oniceconnectionstatechange = () => {
      if (
        peerConnection.iceConnectionState === "failed" ||
        peerConnection.iceConnectionState === "disconnected"
      ) {
        peerConnection.restartIce();
        createOfferFor(remoteUser).catch(console.error);
      }
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

  const flushPendingCandidates = async (remoteUser, pc) => {
    const queuedCandidates = pendingIceCandidates.current[remoteUser] || [];

    if (!queuedCandidates.length) return;

    for (const candidate of queuedCandidates) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }

    pendingIceCandidates.current[remoteUser] = [];
  };

  useEffect(() => {
    const startLocalMedia = async () => {
      if (localStreamRef.current) return;

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true
        });
      }

      localStreamRef.current = stream;

      if (localVideo?.current) {
        localVideo.current.srcObject = stream;
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    };

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
      await flushPendingCandidates(from, pc);
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
      if (!candidate) return;

      if (!pc || !pc.remoteDescription) {
        const prev = pendingIceCandidates.current[from] || [];
        pendingIceCandidates.current[from] = [...prev, candidate];
        return;
      }


      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    };

    startLocalMedia()
      .then(() => {
        socket.emit("addtoserver", username);
        socket.emit("joinRoom", roomName, username);
        socket.emit("requestRoomUsers", roomName);
      })
      .catch(console.error);

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
      remoteVideoRefs.current = {};
      pendingIceCandidates.current = {};

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    };
  }, [roomName, username, localVideo]);

  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }

    Object.entries(remoteStreams).forEach(([member, stream]) => {
      const element = remoteVideoRefs.current[member];
      if (element && element.srcObject !== stream) {
        element.srcObject = stream;
      }
    });
  }, [remoteStreams, party]);

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
              <video
                ref={(el) => {
                  remoteVideoRefs.current[member] = el;
                }}
                autoPlay
                playsInline
                muted={!micOn || !!mutedUsers?.[member]}
              />
              <p>
                {member}
                <button
                  className="participantMuteBtn"
                  onClick={() => toggleRemoteMute(member)}
                  type="button"
                >
                  {mutedUsers?.[member] ? "Unmute" : "Mute"}
                </button>
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}