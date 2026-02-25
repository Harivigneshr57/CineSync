import { useRef, useState, useEffect } from "react";
import { socket } from "../Home/socket";
import Button from "../Login-SignIn/Button";

export default function Participants({ roomName, username, micOn, setMicOn, camOn, setCamOn, mutedUsers, setMutedUsers, localVideo, chat, setChat, party, setParty }) {

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

  useEffect(() => {
    start();

    return () => {
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");

      Object.values(peersRef.current).forEach(pc => pc.close());
    };
  }, []);

  async function start() {
    try {

      localStream.current =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

      localVideo.current.srcObject = localStream.current;

      socket.emit("joinRoom", roomName, username);

      socket.on("all-users", users => {
        users.forEach((id,users) => createPeer(id, true));
      });

      socket.on("user-joined", id => {
        createPeer(id, false);
      });

      socket.on("offer", async data => {

        let pc = peersRef.current[data.from];
        if (!pc) pc = createPeer(data.from, false);

        await pc.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );

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

      socket.on("answer", async data => {
        const pc = peersRef.current[data.from];
        if (!pc) return;

        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        }
      });

      socket.on("ice-candidate", async data => {

        const pc = peersRef.current[data.from];
        if (!pc) return;

        const candidate =
          new RTCIceCandidate(data.candidate);

        if (pc.remoteDescription) {
          await pc.addIceCandidate(candidate);
        } else {
          if (!iceQueue.current[data.from])
            iceQueue.current[data.from] = [];

          iceQueue.current[data.from].push(candidate);
        }
      });

    } catch (err) {
      console.error(err);
    }
  }

  function createPeer(userId, initiator) {

    if (peersRef.current[userId])
      return peersRef.current[userId];

    const pc = new RTCPeerConnection(pcConfig);
    peersRef.current[userId] = pc;

    localStream.current.getTracks().forEach(track =>
      pc.addTrack(track, localStream.current)
    );

    pc.ontrack = e => {
      setRemoteStreams(prev => {

        if (prev.find(p => p.id === userId))
          return prev;

        return [...prev, { id: userId, stream: e.streams[0] }];
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
      pc.createOffer()
        .then(o => pc.setLocalDescription(o))
        .then(() => {
          socket.emit("offer", {
            offer: pc.localDescription,
            to: userId
          });
        });
    }

    return pc;
  }

  function toggleUserMute(id) {
    setMutedUsers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  function Video({ stream, muted }) {

    const ref = useRef(null);

    useEffect(() => {
      if (ref.current) {
        ref.current.srcObject = stream;
        ref.current.muted = muted;
      }
    }, [stream, muted]);

    return (
      <video ref={ref} autoPlay playsInline />
    );
  }

  function close(){
    setParty(false);
  }

  return (
    <div className="roomParticipants" style={{display:party?'block':'none'}}>

      <div className="participantsHead">
        <h2>Participants</h2>
        <Button id="chatClose"><i class="fa-solid fa-xmark" onClick={close}></i></Button>
      </div>

      <div className="participantsBody">

        <div className="video">
        <video
          ref={localVideo}
          autoPlay
          muted
          playsInline
        />
        <div className="personDetails">
            <h6>YOU</h6>
            {micOn?<i className="fa-solid fa-microphone"></i>:<i class="fa-solid fa-microphone-slash"></i>}
        </div>
        </div>

        {remoteStreams.map(user => (
          <div key={user.id} className="video" onClick={toggleUserMute}>

            <Video
              stream={user.stream}
              muted={mutedUsers[user.id]}
            />

        <div className="personDetails">
            <h6>FRIEND</h6>
            <h5>{micOn?'Click to Mute':'Click to Unmute'}</h5> 
        </div>

            {/* <button onClick={() => toggleUserMute(user.id)}>
              {mutedUsers[user.id] ? "Unmute User" : "Mute User"}
            </button> */}

          </div>
        ))}

      </div>
    </div>
  );
}