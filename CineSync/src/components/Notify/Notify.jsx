import { useEffect } from "react";
import SideBar from "../Home/SideBar";
import Notification from "./Notification";
import { UserContext } from "../Login-SignIn/UserContext";
import { useContext } from "react";
import './notify.css';
import { socket } from "../Home/socket";
import EmptyState from "../Common/EmptyState";


export default function Notify() {

    const { roomDetails ,setRoomDetails} = useContext(UserContext);

    function handleDeclineInvitation(roomName) {
        setRoomDetails((prev) => prev.filter((room) => room.room_name !== roomName));
    }
    async function handleClearAllInvitations() {
        const username = localStorage.getItem("Username");

        if (!username) {
            setRoomDetails([]);
            return;
        }

        try {
            const response = await fetch("https://cinesync-3k1z.onrender.com/clearInvitations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                throw new Error("Failed to clear invitations");
            }

            setRoomDetails([]);
        } catch (err) {
            console.log("Error while clearing invitations", err);
        }
    }

    useEffect(()=>{
        socket.on("sendingInvite",(room_name,movie_name,sender_name,video,image)=>{
            setRoomDetails(prev => [
                {
                    room_name,
                    sender_name,
                    movie_name,
                    timestamp:"2026-02-18T04:55:24.000Z",
                    video,
                    image
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
                <p className="clear" onClick={handleClearAllInvitations}>Clear All</p>
            </div>

            <div id="notMain">
            {roomDetails.length === 0 ? (
                    <EmptyState
                        message="No invitations"
                        iconClass="fa-solid fa-bell-slash"
                        className="notify-empty"
                    />
                ) : (
                    roomDetails.map((rooms, i) => {
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
                        return <Notification key={i} roomName={rooms.room_name} ownerName={rooms.sender_name} movieName={rooms.movie_name} timeStamp={timestamp} image={rooms.image} video={rooms.video} onDecline={handleDeclineInvitation}></Notification>
                    })
                )}
            </div>
        </div>
    )
}