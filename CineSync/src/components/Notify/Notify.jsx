import { useEffect } from "react";
import SideBar from "../Home/SideBar";
import Notification from "./Notification";
import { UserContext } from "../Login-SignIn/UserContext";
import { useContext } from "react";
import './notify.css';
import { socket } from "../Home/socket";
import EmptyState from "../Common/EmptyState";


export default function Notify() {

    const { roomDetails, setRoomDetails } = useContext(UserContext);
    const safeRoomDetails = Array.isArray(roomDetails) ? roomDetails : [];

    function handleDeclineInvitation(inviteId) {
        setRoomDetails((prev = []) => prev.filter((room) => room.invite_id !== inviteId));
    }
    async function fetchInvitations() {
        const username = localStorage.getItem("Username");

        if (!username) {
            setRoomDetails([]);
            return;
        }

        try {
            const response = await fetch("https://cinesync-3k1z.onrender.com/getInvitations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch invitations");
            }

            const data = await response.json();
            setRoomDetails(data.allnotification || []);
        console.log(roomDetails,"noti");

        } catch (err) {
            console.log("Error while fetching invitations", err);
        }
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
        fetchInvitations();
        socket.on("sendingInvite",(room_code,movie_name,sender_name,video,image)=>{
            setRoomDetails((prev = []) => [
                {
                    invite_id: `socket-${Date.now()}-${Math.random()}`,
                    room_code,
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
    },[setRoomDetails])


    return (
        <div id="notificationMain">
            <SideBar></SideBar>
            <div className="notTitle">
                <h2>Watch party Invites</h2>
                <p className="clear" onClick={handleClearAllInvitations}>Clear All</p>
            </div>

            <div id="notMain">
            {safeRoomDetails.length === 0 ? (
                    <EmptyState
                        message="No invitations"
                        iconClass="fa-solid fa-bell-slash"
                        className="notify-empty"
                    />
                ) : (
                    safeRoomDetails.map((rooms, i) => {
                        let timestamp = "";
                        const date = new Date(rooms.created_at || rooms.timestamp || Date.now());
                        const hours = date.getUTCHours();
                        if (hours < 1) {
                            timestamp = "now";
                        }
                        else if (hours >= 24) {
                            timestamp = Math.floor(hours / 24) + "d";
                        }
                        else {
                            timestamp = hours + "h";
                        }
                        return <Notification key={rooms.invite_id || i} inviteId={rooms.invite_id} roomName={rooms.room_name} roomCode={rooms.room_code} ownerName={rooms.sender_name} movieName={rooms.movie_name} timeStamp={timestamp} image={rooms.image} video={rooms.video} onDecline={handleDeclineInvitation}></Notification>
                    })
                )}
            </div>
        </div>
    )
}