import { useRef, useState, useEffect } from "react";
import { socket } from "../Home/socket";

export default function Participants({ roomName, username }) {

  const localVideo = useRef(null);
  const peersRef = useRef({});
  const localStream = useRef(null);

  const [remoteStreams, setRemoteStreams] = useState([]);

  /* ================= ICE CONFIG ================= */

  const pcConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  };

  /* ================= START ================= */

  useEffect(() => {
    start();

    // ✅ cleanup listeners when component unmounts
    return () => {
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");

      Object.values(peersRef.current).forEach(pc => pc.close());
    };
  }, []);

  /* ================= MAIN START ================= */

  async function start() {
    try {
      // get camera + mic
      localStream.current =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

      if (localVideo.current) {
        localVideo.current.srcObject = localStream.current;
      }

      // join socket room
      socket.emit("joinRoom", roomName, username);

      /* ---------- EXISTING USERS ---------- */
      socket.on("all-users", users => {
        users.forEach(id => createPeer(id, true));
      });

      /* ---------- NEW USER JOIN ---------- */
      socket.on("user-joined", id => {
        createPeer(id, false);
      });

      /* ---------- RECEIVE OFFER ---------- */
      socket.on("offer", async data => {

        let pc = peersRef.current[data.from];

        // ✅ create only if not exists
        if (!pc) {
          pc = createPeer(data.from, false);
        }

        await pc.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", {
          answer,
          to: data.from
        });
      });

      /* ---------- RECEIVE ANSWER ---------- */
      socket.on("answer", async data => {
        const pc = peersRef.current[data.from];
        if (pc) {
          await pc.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        }
      });

      /* ---------- ICE CANDIDATE ---------- */
      socket.on("ice-candidate", async data => {
        const pc = peersRef.current[data.from];

        if (pc && data.candidate) {
          await pc.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        }
      });

    } catch (err) {
      console.error("Media error:", err);
    }
  }

  /* ================= CREATE PEER ================= */

  function createPeer(userId, initiator) {

    // ✅ prevent duplicate peer
    if (peersRef.current[userId]) {
      return peersRef.current[userId];
    }

    const pc = new RTCPeerConnection(pcConfig);
    peersRef.current[userId] = pc;

    // add local tracks
    localStream.current.getTracks().forEach(track =>
      pc.addTrack(track, localStream.current)
    );

    /* ---------- REMOTE STREAM ---------- */
    pc.ontrack = e => {
      setRemoteStreams(prev => {

        if (prev.find(p => p.id === userId)) return prev;

        return [
          ...prev,
          {
            id: userId,
            stream: e.streams[0]
          }
        ];
      });
    };

    /* ---------- ICE ---------- */
    pc.onicecandidate = e => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          candidate: e.candidate,
          to: userId
        });
      }
    };

    /* ---------- OFFER (INITIATOR) ---------- */
    if (initiator) {
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => {
          socket.emit("offer", {
            offer: pc.localDescription,
            to: userId
          });
        });
    }

    return pc;
  }

  /* ================= VIDEO COMPONENT ================= */

  function Video({ stream }) {
    const ref = useRef(null);

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
      />
    );
  }

  /* ================= UI ================= */

  return (
    <div className="roomParticipants">

      <div className="participantsHead">
        Participants
      </div>

      <div className="participantsBody">

        {/* Local Video */}
        <video
          ref={localVideo}
          autoPlay
          muted
          playsInline
        />

        {/* Remote Videos */}
        {remoteStreams.map(user => (
          <Video key={user.id} stream={user.stream} />
        ))}

      </div>
    </div>
  );
}