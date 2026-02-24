import { useContext, useState } from "react";
import Madharasi from "../../assets/images/Madharasi.png";
import Onnapak from "../../assets/onnapak.png";
import {socket} from "../Home/socket";
import { UserContext } from "../Login-SignIn/UserContext";
import { useNavigate } from "react-router-dom";
export default function Notification({roomName, ownerName,movieName,moviestatus,timeStamp,image,video}){
    const [currentRoom ,setcurrentRoom] = useState("");
    const {changeRoomVideo} = useContext(UserContext);
    let nav =useNavigate();

    function declineinvitation(){

    }

    function acceptInvitation(room,video){
        console.log("The room user want to join: "+room);
        localStorage.setItem("Roomname",room);
        changeRoomVideo(video);
        nav("/waitingRoom");
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
                        <p className="movieTitleNot">{movieName}<span className="timeForMovie">{moviestatus}</span></p>
                    </div>
                    <p className="timeStamp">{timeStamp}</p>
                </div>
                <div className="buttonDiv">
                    <button className="joinNot" onClick={()=>{acceptInvitation(roomName,video)}}>Join Room</button>
                    <button className="declineNot" onClick={()=>{declineinvitation}} >Decline</button>
                </div>
            </div>
        </div>
        </>
    )
}