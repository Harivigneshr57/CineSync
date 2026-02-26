import LobbyChat from "../WaitingRoom/LobbyChat";
import Lobbymembers from "../WaitingRoom/Lobbymembers";
import { useEffect, useState } from "react";
import { socket } from "../Home/socket";
import toast from "react-hot-toast";

export default function HostView() {

    const [connectedMembers, setConnectedMembers] = useState([]);

    const toastSuccessStyle = {
        style: {
          borderRadius: "1rem",
          background: "#16A34A",
          color: "white",
          fontWeight: 600
        },
        iconTheme: {
          primary: "white",
          secondary: "#16A34A"
        }
      };
      
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
    
            if (data.allmembers) {
                setConnectedMembers(data.allmembers);
            }
    
        });
    
        socket.on("newJoin", (username) => {
            setConnectedMembers(prev => {
    
                const exists = prev.some(
                    member => member.username === username
                );
    
                if (exists) return prev;
                
                if(username!=localStorage.getItem("Username")){
                    toast.success(username+" joined the room",toastSuccessStyle);
                }

                return [
                    ...prev,
                    {
                        username: username,
                        status: "Not Ready"
                    }
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
            <Lobbymembers connectedmemebers={connectedMembers} />
        </>
    );

}