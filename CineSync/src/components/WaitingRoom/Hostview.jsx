import LobbyChat from "../WaitingRoom/LobbyChat";
import Lobbymembers from "../WaitingRoom/Lobbymembers";
import { useEffect, useState } from "react";
import { socket } from "../Home/socket";

export default function HostView() {

    const [connectedMembers, setConnectedMembers] = useState([]);

    useEffect(() => {

        const room = localStorage.getItem("Roomname");
        const username = localStorage.getItem("Username");
    
        if (!room || !username) return;
    
        socket.emit("joinRoom", room, username);
    
        fetch("https://cinesync-3k1z.onrender.com/getAllParticipants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                roomName: room,
                userName: username
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
    
            if (data.allmembers) {
                console.log(data);
                setConnectedMembers(data.allmembers);
            }
    
        });
    
        socket.on("newJoin", (id,username) => {
    
            setConnectedMembers(prev => {
    
                const exists = prev.some(
                    member => member.username === username
                );
    
                if (exists) return prev;
    
                return [
                    {
                        username: username,
                        status: "Not Ready"
                    },
                    ...prev
                ];
    
            });
    
        });
    
        return () => {
            socket.off("newJoin");
        };
    
    }, []);


    return (
        <>
            <LobbyChat />
            <Lobbymembers connectedMembers={connectedMembers} />
        </>
    );

}