import { useState } from "react";
import Madharasi from "../../assets/images/Madharasi.png";
import Onnapak from "../../assets/onnapak.png";
import {socket} from "../Home/socket";
import { useNavigate } from "react-router-dom";
export default function Notification({roomName, ownerName,movieName,moviestatus,timeStamp}){
    const [currentRoom ,setcurrentRoom] = useState("");
    let nav =useNavigate();

    function declineinvitation(){

    }

    function acceptInvitation(room){
        console.log("The room user want to join: "+room);
        localStorage.setItem("Roomname",room);
        nav("/waitingRoom");
    }

    return(
        <>
        <div className="notificatinDiv">
            <img className="notImage" src={Madharasi} alt="Movie Image"></img>
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
                    <button className="joinNot" onClick={()=>{acceptInvitation(roomName)}}>Join Room</button>
                    <button className="declineNot" onClick={()=>{declineinvitation}} >Decline</button>
                </div>
            </div>
        </div>
        </>
    )
}