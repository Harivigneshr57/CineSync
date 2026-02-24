import { useRef, useState, useEffect } from "react";
import { socket } from "../Home/socket";

export default function Participants({ roomName, username }) {

//   const localVideo = useRef(null);
//   const peersRef = useRef({});
//   const localStream = useRef(null);
//   const iceQueue = useRef({});

//   const [remoteStreams, setRemoteStreams] = useState([]);

//   /* ================= ICE SERVERS ================= */

//   const pcConfig = {
//     iceServers: [
//       { urls: "stun:stun.l.google.com:19302" },

//       // FREE TURN (important for internet users)
//       {
//         urls: "turn:openrelay.metered.ca:80",
//         username: "openrelayproject",
//         credential: "openrelayproject"
//       }
//     ]
//   };

//   /* ================= START ================= */

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

//       /* GET CAMERA FIRST */
//       localStream.current =
//         await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true
//         });

//       if (localVideo.current)
//         localVideo.current.srcObject = localStream.current;

//       /* JOIN ROOM AFTER MEDIA READY */
//       socket.emit("joinRoom", roomName, username);

//       /* EXISTING USERS */
//       socket.on("all-users", users => {
//         users.forEach(id => createPeer(id, true));
//       });

//       /* NEW USER */
//       socket.on("user-joined", id => {
//         createPeer(id, false);
//       });

//       /* RECEIVE OFFER */
//       socket.on("offer", async data => {

//         let pc = peersRef.current[data.from];

//         if (!pc)
//           pc = createPeer(data.from, false);

//         await pc.setRemoteDescription(
//           new RTCSessionDescription(data.offer)
//         );

//         /* flush queued ICE */
//         if (iceQueue.current[data.from]) {
//           for (const c of iceQueue.current[data.from]) {
//             await pc.addIceCandidate(c);
//           }
//           iceQueue.current[data.from] = [];
//         }

//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);

//         socket.emit("answer", {
//           answer,
//           to: data.from
//         });
//       });

//       /* RECEIVE ANSWER */
//       socket.on("answer", async data => {

//         const pc = peersRef.current[data.from];
//         if (!pc) return;

//         // prevent wrong state error
//         if (pc.signalingState === "have-local-offer") {
//           await pc.setRemoteDescription(
//             new RTCSessionDescription(data.answer)
//           );
//         }
//       });

//       /* RECEIVE ICE */
//       socket.on("ice-candidate", async data => {

//         const pc = peersRef.current[data.from];
//         if (!pc) return;

//         const candidate =
//           new RTCIceCandidate(data.candidate);

//         if (pc.remoteDescription) {
//           await pc.addIceCandidate(candidate);
//         } else {
//           if (!iceQueue.current[data.from])
//             iceQueue.current[data.from] = [];

//           iceQueue.current[data.from].push(candidate);
//         }
//       });

//     } catch (err) {
//       console.error("Media error:", err);
//     }
//   }

//   /* ================= CREATE PEER ================= */

//   function createPeer(userId, initiator) {

//     if (peersRef.current[userId])
//       return peersRef.current[userId];

//     const pc = new RTCPeerConnection(pcConfig);
//     peersRef.current[userId] = pc;

//     /* SEND LOCAL TRACKS */
//     localStream.current.getTracks().forEach(track =>
//       pc.addTrack(track, localStream.current)
//     );

//     /* RECEIVE REMOTE STREAM */
//     pc.ontrack = e => {
//       setRemoteStreams(prev => {

//         if (prev.find(p => p.id === userId))
//           return prev;

//         return [
//           ...prev,
//           { id: userId, stream: e.streams[0] }
//         ];
//       });
//     };

//     /* ICE */
//     pc.onicecandidate = e => {
//       if (e.candidate) {
//         socket.emit("ice-candidate", {
//           candidate: e.candidate,
//           to: userId
//         });
//       }
//     };

//     /* DEBUG */
//     pc.onconnectionstatechange = () => {
//       console.log("Peer", userId, pc.connectionState);
//     };

//     /* CREATE OFFER */
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

//   /* ================= VIDEO COMPONENT ================= */

//   function Video({ stream }) {

//     const ref = useRef(null);

//     useEffect(() => {
//       if (ref.current)
//         ref.current.srcObject = stream;
//     }, [stream]);

//     return (
//       <video
//         ref={ref}
//         autoPlay
//         playsInline
//       />
//     );
//   }

//   /* ================= UI ================= */

//   return (
//     <div className="roomParticipants">

//       <div className="participantsHead">
//         Participants
//       </div>

//       <div className="participantsBody">

//         {/* LOCAL */}
//         <video
//           ref={localVideo}
//           autoPlay
//           muted
//           playsInline
//         />

//         {/* REMOTES */}
//         {remoteStreams.map(user => (
//           <Video key={user.id} stream={user.stream} />
//         ))}

//       </div>
//     </div>
//   );
}