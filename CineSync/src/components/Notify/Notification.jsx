import { useContext, useEffect } from "react";
import Onnapak from "../../assets/onnapak.png";
import {socket} from "../Home/socket";
import { UserContext } from "../Login-SignIn/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function Notification({ inviteId, roomName, roomCode, ownerName, movieName, moviestatus, timeStamp, image, video, onDecline }) {
    const { changeRoomVideo, setRoomName, setMovieName, setAsRoom } = useContext(UserContext);
    let nav = useNavigate();

    async function declineinvitation() {
        try {
            const response = await fetch("https://cinesync-3k1z.onrender.com/declineInvitation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ invite_id: inviteId }),
            });

            if (!response.ok) {
                throw new Error("Failed to decline invitation");
            }

            onDecline(inviteId);
        } catch (err) {
            console.log("Error while declining invitation", err);
        }
    }

    useEffect(()=>{
        setAsRoom(false);
      },[])


    async function acceptInvitation() {
        try {
            const roomRes = await fetch("https://cinesync-3k1z.onrender.com/getRoomById", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomCode })
            });
            const roomData = await roomRes.json();
            if (!roomData.roomname) {
                toast.error("Room not found");
                return;
            }

            localStorage.setItem("Roomname", roomData.roomname);
            setAsRoom(true);
            changeRoomVideo(roomData.movie_url || video);
            localStorage.setItem('MovieName', roomData.title || movieName);
            localStorage.setItem('MovieImage', roomData.movie_poster || image);
            localStorage.setItem('movieVideo', roomData.movie_url || video);
            localStorage.setItem("RoomCode", roomCode);
            setRoomName(roomData.roomname);
            setMovieName(roomData.title || movieName);

            const roomStatusRes = await fetch("https://cinesync-3k1z.onrender.com/roomcheck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomCode })
            });
            const roomStatusData = await roomStatusRes.json();
            const hasStarted = Array.isArray(roomStatusData?.result) && roomStatusData.result.length === 1;

            await fetch("https://cinesync-3k1z.onrender.com/addToRoom", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomname: roomData.roomname,
                    roomCode: roomCode,
                    username: localStorage.getItem("Username"),
                    Role: "member",
                    status: 0
                })
            });

            socket.emit("joinRoom", roomData.roomname, localStorage.getItem("Username"));

            if (hasStarted) {
                const hostRes = await fetch("https://cinesync-3k1z.onrender.com/getHostName", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ roomname: roomData.roomname })
                });

                const hostData = await hostRes.json();
                const hostName = hostData?.hostname?.[0]?.username;

                if (hostName) {
                    localStorage.setItem("HostName", hostName);
                    socket.emit("middlejoin", localStorage.getItem("Username"), roomData.roomname, hostName);
                }

                nav("/summary");
                return;
            }

            nav("/waitingRoom");
        } catch (error) {
            console.log(error);
            toast.error("Unable to join room right now");
        }
    }

    return(
        <>
        <div className="notificatinDiv">
                <img className="notImage" src={image} alt="Movie Image"></img>
                <div className="notDetail">
                    <div className="notDet">
                        <div className="notDetLeft">
                            <div className="notOwner">
                                <img src={Onnapak} alt="profile"></img>
                                <p>{ownerName}<span> invited you</span></p>
                            </div>
                            <h3 className="roomNameNot">{roomName}</h3>
                            <p className="movieTitleNot">Room ID: {roomCode}</p>
                            <p className="movieTitleNot">{movieName}<span className="timeForMovie">{moviestatus}</span></p>
                        </div>
                        <p className="timeStamp">{timeStamp}</p>
                    </div>
                    <div className="buttonDiv">
                        <button className="joinNot" onClick={acceptInvitation}>Join Room</button>
                        <button className="declineNot" onClick={declineinvitation} >Decline</button>
                    </div>
                    </div>
            </div>
        </>
    )
}