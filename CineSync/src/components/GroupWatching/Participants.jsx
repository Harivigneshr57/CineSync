import { useRef, useState, useEffect } from "react";
import { socket } from "../Home/socket";

export default function Participants({ roomName, username }) {

//   const localVideo = useRef(null);
//   const peersRef = useRef({});
//   const localStream = useRef(null);

//   const [remoteStreams, setRemoteStreams] = useState([]);


//   const pcConfig = {
//     iceServers: [
//       { urls: "stun:stun.l.google.com:19302" }
//     ]
//   };


//   useEffect(() => {
//     start();

//     return () => {
//       socket.off("all-users");
//       socket.off("user-joined");
//       socket.off("offer");
//       socket.off("answer");
//       socket.off("ice-candidate");

//       Object.values(peersRef.current).forEach(pc => pc.close());
//     };
//   }, []);

//   async function start() {
//     try {
//       localStream.current =
//         await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true
//         });

//       if (localVideo.current) {
//         localVideo.current.srcObject = localStream.current;
//       }

//       socket.emit("joinRoom", roomName, username);

//       socket.on("all-users", users => {
//         users.forEach(id => createPeer(id, true));
//       });

//       socket.on("user-joined", id => {
//         createPeer(id, false);
//       });

//       socket.on("offer", async data => {

//         let pc = peersRef.current[data.from];

//         if (!pc) {
//           pc = createPeer(data.from, false);
//         }

//         await pc.setRemoteDescription(
//           new RTCSessionDescription(data.offer)
//         );

//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);

//         socket.emit("answer", {
//           answer,
//           to: data.from
//         });
//       });

//       socket.on("answer", async data => {
//         const pc = peersRef.current[data.from];
//         if (pc) {
//           await pc.setRemoteDescription(
//             new RTCSessionDescription(data.answer)
//           );
//         }
//       });

//       socket.on("ice-candidate", async data => {
//         const pc = peersRef.current[data.from];

//         if (pc && data.candidate) {
//           await pc.addIceCandidate(
//             new RTCIceCandidate(data.candidate)
//           );
//         }
//       });

//     } catch (err) {
//       console.error("Media error:", err);
//     }
//   }


//   function createPeer(userId, initiator) {

//     if (peersRef.current[userId]) {
//       return peersRef.current[userId];
//     }

//     const pc = new RTCPeerConnection(pcConfig);
//     peersRef.current[userId] = pc;

//     localStream.current.getTracks().forEach(track =>
//       pc.addTrack(track, localStream.current)
//     );

//     pc.ontrack = e => {
//       setRemoteStreams(prev => {

//         if (prev.find(p => p.id === userId)) return prev;

//         return [
//           ...prev,
//           {
//             id: userId,
//             stream: e.streams[0]
//           }
//         ];
//       });
//     };

//     pc.onicecandidate = e => {
//       if (e.candidate) {
//         socket.emit("ice-candidate", {
//           candidate: e.candidate,
//           to: userId
//         });
//       }
//     };

//     if (initiator) {
//       pc.createOffer()
//         .then(offer => pc.setLocalDescription(offer))
//         .then(() => {
//           socket.emit("offer", {
//             offer: pc.localDescription,
//             to: userId
//           });
//         });
//     }

//     return pc;
//   }


//   function Video({ stream }) {
//     const ref = useRef(null);

//     useEffect(() => {
//       if (ref.current) {
//         ref.current.srcObject = stream;
//       }
//     }, [stream]);

//     return (
//       <video
//         ref={ref}
//         autoPlay
//         playsInline
//       />
//     );
//   }


//   return (
//     <div className="roomParticipants">

//       <div className="participantsHead">
//         Participants
//       </div>

//       <div className="participantsBody">

//         <video
//           ref={localVideo}
//           autoPlay
//           muted
//           playsInline
//         />

//         {remoteStreams.map(user => (
//           <Video key={user.id} stream={user.stream} />
//         ))}

//       </div>
//     </div>
//   );
}