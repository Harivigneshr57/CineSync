import { useRef, useState, useEffect } from "react";
import { socket } from "../Home/socket";

export default function Participants({ roomName, username }) {

  const localVideo = useRef(null);
  const peersRef = useRef({});
  const localStream = useRef(null);

  const [remoteStreams, setRemoteStreams] = useState([]);


  const pcConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  };


  useEffect(() => {
    start();
  }, []);

  async function start() {

    localStream.current =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

    localVideo.current.srcObject = localStream.current;

    socket.emit("joinRoom", roomName, username);

    socket.on("all-users", users => {
      users.forEach(id => createPeer(id, true));
    });

    socket.on("user-joined", id => {
      createPeer(id, false);
    });

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

    socket.on("answer", async data => {
      await peersRef.current[data.from]
        .setRemoteDescription(data.answer);
    });

    socket.on("ice-candidate", async data => {
      await peersRef.current[data.from]
        .addIceCandidate(data.candidate);
    });
  }


  function createPeer(userId, initiator) {

    const pc = new RTCPeerConnection(pcConfig);
    peersRef.current[userId] = pc;

    localStream.current.getTracks().forEach(track =>
      pc.addTrack(track, localStream.current)
    );

    pc.ontrack = e => {
      setRemoteStreams(prev => {

        if (prev.find(p => p.id === userId)) return prev;

        return [...prev, {
          id: userId,
          stream: e.streams[0]
        }];
      });
    };

    pc.onicecandidate = e => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          candidate: e.candidate,
          to: userId
        });
      }
    };

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


  function Video({ stream }) {

    const ref = useRef(null);

    useEffect(() => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    }, [stream]);

    return <video ref={ref} autoPlay />;
  }


  return (
    <div className="roomParticipants">

      <div className="participantsHead">
        Participants
      </div>

      <div className="participantsBody">

        <video ref={localVideo} autoPlay muted />

        {remoteStreams.map(user => (
          <Video key={user.id} stream={user.stream} />
        ))}

      </div>
    </div>
  );
}