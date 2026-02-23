import { useEffect, useState } from "react";
import SideBar from "../Home/SideBar";
import Notification from "./Notification";
import { UserContext } from "../Login-SignIn/UserContext";
import { useContext } from "react";
import './notify.css';
import { socket } from "../Home/socket";


export default function Notify() {
    const { roomDetails ,setRoomDetails} = useContext(UserContext);
    const [invitation, setInvitation] = useState("");
    // {roomName, ownerName,movieName,moviestatus,timeStamp}

    function handleInvitation(roomname) {
        setInvitation(roomname);
    }

    useEffect(()=>{
        socket.on("sendingInvite",(room_name,movie_name,sender_name)=>{
            setRoomDetails(prev => [
                {
                    room_name,
                    sender_name,
                    movie_name,
                    timestamp:"2026-02-18T04:55:24.000Z"
                },
                ...prev,
            ]);
        });

        return () => {
            socket.off("sendingInvite");
        };

    },[roomDetails])

    return (
        <div id="notificationMain">
            <SideBar></SideBar>
            <div className="notTitle">
                <h2>Watch party Invites</h2>
                <p className="clear">Clear All</p>
            </div>

            <div id="notMain">
                {roomDetails.map((rooms, i) => {
                    let timestamp = "";
                    console.log("Time: " + rooms.created_at)
                    const date = new Date(rooms.created_at);
                    const hours = date.getUTCHours();
                    const minutes = date.getUTCMinutes();

                    if (hours < 0) {
                        timestamp = minutes + "m";
                    }
                    else if (hours => 24) {
                        timestamp = Math.floor(hours / 24) + "d";
                    }
                    else {
                        timestamp = hours + "h";
                    }

                    return <Notification key={i} roomName={rooms.room_name} ownerName={rooms.sender_name} movieName={rooms.movie_name} timeStamp={timestamp} ></Notification>
                })}
            </div>
        </div>
    )
}