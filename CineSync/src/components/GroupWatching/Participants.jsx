import React, { useRef, useState, useEffect } from "react";
import { socket } from "../Home/socket";
import Button from "../Login-SignIn/Button";

/* ================= VIDEO COMPONENT ================= */

const Video = React.memo(({ stream, muted }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !stream) return;

    ref.current.srcObject = stream;
    ref.current.muted = muted ?? false;
  }, [stream, muted]);

  return <video ref={ref} autoPlay playsInline />;
});

/* ================= MAIN COMPONENT ================= */

export default function Participants({
  roomName,
  username,
  micOn,
  setMicOn,
  camOn,
  setCamOn,
  mutedUsers,
  setMutedUsers,
  localVideo,
  party,
  setParty
}) {
  const peersRef = useRef({});
  const localStream = useRef(null);
  const iceQueue = useRef({});

  const [remoteStreams, setRemoteStreams] = useState([]);

  /* ================= ICE CONFIG ================= */

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

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (!party) return;

    start();

    return () => {
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");

      Object.values(peersRef.current).forEach(pc => pc.close());

      localStream.current?.getTracks().forEach(t => t.stop());

      peersRef.current = {};
      setRemoteStreams([]);
    };
  }, [party]);

  /* ================= START ================= */

  async function start() {
    try {
      /* get camera + mic */
      localStream.current =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

      if (localVideo.current) {
        localVideo.current.srcObject = localStream.current;
      }

      socket.emit("ready-for-webrtc", roomName);

      /* existing users */
      socket.on("all-users", users => {
        users.forEach(id => {
          if (localStream.current) {
            createPeer(id, true);
          }
        });
      });

      /* new user joined */
      socket.on("user-joined", id => {
        if (!peersRef.current[id]) {
          createPeer(id, false);
        }
      });

      /* OFFER */
      socket.on("offer", async data => {
        let pc = peersRef.current[data.from];
        if (!pc) pc = createPeer(data.from, false);

        await pc.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );

        /* apply queued ICE */
        if (iceQueue.current[data.from]) {
          for (const c of iceQueue.current[data.from]) {
            await pc.addIceCandidate(c);
          }
          iceQueue.current[data.from] = [];
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", {
          answer,
          to: data.from
        });
      });

      /* ANSWER */
      socket.on("answer", async data => {
        const pc = peersRef.current[data.from];
        if (!pc) return;

        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        }
      });

      /* ICE */
      socket.on("ice-candidate", async data => {
        const pc = peersRef.current[data.from];
        if (!pc) return;

        const candidate = new RTCIceCandidate(data.candidate);

        if (pc.remoteDescription) {
          await pc.addIceCandidate(candidate);
        } else {
          if (!iceQueue.current[data.from])
            iceQueue.current[data.from] = [];

          iceQueue.current[data.from].push(candidate);
        }
      });

      socket.on("user-left", id => {
        if (peersRef.current[id]) {
          peersRef.current[id].close();
          delete peersRef.current[id];
        }
      
        setRemoteStreams(prev =>
          prev.filter(p => p.id !== id)
        );
      });

    } catch (err) {
      console.error("Media error:", err);
    }
  }

  /* ================= CREATE PEER ================= */

  function createPeer(userId, initiator) {
    if (peersRef.current[userId])
      return peersRef.current[userId];

    const pc = new RTCPeerConnection(pcConfig);
    peersRef.current[userId] = pc;

    /* add local tracks */
    localStream.current.getTracks().forEach(track => {
      pc.addTrack(track, localStream.current);
    });

    /* receive remote stream */
    pc.ontrack = event => {
      const stream = event.streams[0];

      setRemoteStreams(prev => {
        const existing = prev.find(p => p.id === userId);

        if (existing) {
          return prev.map(p =>
            p.id === userId ? { ...p, stream } : p
          );
        }

        return [...prev, { id: userId, stream }];
      });
    };

    /* ICE send */
    pc.onicecandidate = e => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          candidate: e.candidate,
          to: userId
        });
      }
    };

    /* connection debug */
    pc.onconnectionstatechange = () => {
      console.log("Connection", userId, pc.connectionState);
    };

    /* ✅ FIXED NEGOTIATION */
    if (initiator) {
      setTimeout(async () => {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
    
          socket.emit("offer", {
            offer,
            to: userId
          });
        } catch (err) {
          console.error("Negotiation error:", err);
        }
      }, 300);
    }

    return pc;
  }

  /* ================= UI ================= */

  function toggleUserMute(id) {
    setMutedUsers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  function close() {
    setParty(false);
  }

  return (
    <div
      className="roomParticipants"
      style={{ display: party ? "block" : "none" }}
    >
      <div className="participantsHead">
        <h2>Participants</h2>
        <Button>
          <i className="fa-solid fa-xmark" onClick={close}></i>
        </Button>
      </div>

      <div className="participantsBody">

        {/* LOCAL VIDEO */}
        <div className="video">
          <video ref={localVideo} autoPlay muted playsInline />

          <div className="personDetails">
            <h6>YOU</h6>
            {micOn
              ? <i className="fa-solid fa-microphone"></i>
              : <i className="fa-solid fa-microphone-slash"></i>}
          </div>
        </div>

        {/* REMOTE USERS */}
        {remoteStreams.map(user => (
          <div
            key={user.id}
            className="video"
            onClick={() => toggleUserMute(user.id)}
          >
            <Video
              stream={user.stream}
              muted={mutedUsers[user.id]}
            />

            <div className="personDetails">
              <h6>FRIEND</h6>
              <h5>
                {mutedUsers[user.id]
                  ? "Click to Unmute"
                  : "Click to Mute"}
              </h5>

              {mutedUsers[user.id]
                ? <i className="fa-solid fa-microphone-slash"></i>
                : <i className="fa-solid fa-microphone"></i>}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}