import { useContext,useState, useEffect } from "react";
import Madharasi from "../../assets/images/Madharasi.png";
import Onnapak from "../../assets/onnapak.png";
import {socket} from "../Home/socket";
import { UserContext } from "../Login-SignIn/UserContext";
import { useNavigate } from "react-router-dom";
export default function Notification({roomName, ownerName,movieName,moviestatus,timeStamp,image,video,onDecline}){
    const [currentRoom ,setcurrentRoom] = useState("");
    const {changeRoomVideo,setRoomName,setMovieName,changeRoomDetail,setAsRoom} = useContext(UserContext);
    let nav =useNavigate();

    async function declineinvitation(){
        try {
            const response = await fetch("https://cinesync-3k1z.onrender.com/declineInvitation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ invitation: roomName }),
            });

            if (!response.ok) {
                throw new Error("Failed to decline invitation");
            }

            onDecline(roomName);
        } catch (err) {
            console.log("Error while declining invitation", err);
        }
    }


    function acceptInvitation(room,video,movie){
        console.log("The room user want to join: "+room);
        localStorage.setItem("Roomname",room);
        console.log(video)
        setAsRoom(true);
        changeRoomVideo(video);
        localStorage.setItem('MovieName',movie);
        localStorage.setItem('MovieImage',image);
        localStorage.setItem('movieVideo',video);
        setRoomName(room);
        setMovieName(movie);
        nav("/waitingRoom");
    }

    useEffect(() => {

        async function rendernotification() {
            try {
                const response = await fetch("https://cinesync-3k1z.onrender.com/getInvitations", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: localStorage.getItem("Username"),
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch notifications");
                }

                const data = await response.json();
                console.log(data.allnotification);
                changeRoomDetail(data.allnotification);
            }
            catch (err) {
                console.log("Error in get message");
            }
        }
        rendernotification();


        const username = localStorage.getItem("Username");

        socket.emit("addtoserver", username);

        socket.on("sendingInvite", (room_name, movie_name, sender_name) => {
            console.log("Invite received");
            console.log(room_name, movie_name, sender_name);
            setMessage(true);
        });

        return () => {
            socket.off("sendingInvite");
        };

    }, []);

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
                        <p className="movieTitleNot">{movieName}<span className="timeForMovie">{moviestatus}</span></p>
                    </div>
                    <p className="timeStamp">{timeStamp}</p>
                </div>
                <div className="buttonDiv">
                    <button className="joinNot" onClick={()=>{acceptInvitation(roomName,video,movieName)}}>Join Room</button>
                    <button className="declineNot" onClick={declineinvitation} >Decline</button>
                </div>
            </div>
        </div>
        </>
    )
}