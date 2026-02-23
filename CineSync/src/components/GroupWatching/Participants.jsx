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
  }, []);

  async function start() {

    /* get camera */
    localStream.current =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

    localVideo.current.srcObject = localStream.current;

    /* join your existing room */
    socket.emit("joinRoom", roomName, username);

    /* existing users */
    socket.on("all-users", users => {
      users.forEach(id => createPeer(id, true));
    });

    /* new user */
    socket.on("user-joined", id => {
      createPeer(id, false);
    });

    /* receive offer */
    socket.on("offer", async data => {

      const pc = createPeer(data.from, false);

      await pc.setRemoteDescription(data.offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", {
        answer,
        to: data.from
      });
    });

    /* receive answer */
    socket.on("answer", async data => {
      await peersRef.current[data.from]
        .setRemoteDescription(data.answer);
    });

    /* ICE */
    socket.on("ice-candidate", async data => {
      await peersRef.current[data.from]
        .addIceCandidate(data.candidate);
    });
  }

  /* ================= CREATE PEER ================= */

  function createPeer(userId, initiator) {

    const pc = new RTCPeerConnection(pcConfig);
    peersRef.current[userId] = pc;

    /* send tracks */
    localStream.current.getTracks().forEach(track =>
      pc.addTrack(track, localStream.current)
    );

    /* receive remote stream */
    pc.ontrack = e => {
      setRemoteStreams(prev => {

        if (prev.find(p => p.id === userId)) return prev;

        return [...prev, {
          id: userId,
          stream: e.streams[0]
        }];
      });
    };

    /* ICE */
    pc.onicecandidate = e => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          candidate: e.candidate,
          to: userId
        });
      }
    };

    /* create offer */
    if (initiator) {
      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer);

        socket.emit("offer", {
          offer,
          to: userId
        });
      });
    }

    return pc;
  }

  /* ================= REMOTE VIDEO ================= */

  function Video({ stream }) {

    const ref = useRef(null);

    useEffect(() => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    }, [stream]);

    return <video ref={ref} autoPlay />;
  }

  /* ================= UI ================= */

  return (
    <div className="roomParticipants">

      <div className="participantsHead">
        Participants
      </div>

      <div className="participantsBody">

        {/* LOCAL VIDEO */}
        <video ref={localVideo} autoPlay muted />

        {/* REMOTE USERS */}
        {remoteStreams.map(user => (
          <Video key={user.id} stream={user.stream} />
        ))}

      </div>
    </div>
  );
}