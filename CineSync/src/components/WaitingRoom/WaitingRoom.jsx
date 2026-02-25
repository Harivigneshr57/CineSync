import { useState, useEffect } from "react";
import SideBar from "../Home/SideBar";
import LobbyChat from "./LobbyChat";
import Lobbymembers from "./Lobbymembers";
import WaitingMain from "./WaitingMain";
import "./waitingroom.css";
import { socket } from "../Home/socket";
import { useNavigate } from "react-router-dom";

export default function WaitingRoom() {
    const [connectedMembers, setConnectedMemebers] = useState([]);
    const navigate = useNavigate();

    // useEffect(() => {
    //     socket.emit("joinRoom", localStorage.getItem("Roomname"), localStorage.getItem("Username"));
    // }, [])

    useEffect(() => {

        async function initRoom() {

            try {

                const joinRes = await fetch("https://cinesync-3k1z.onrender.com/addToRoom", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        roomname: localStorage.getItem("Roomname"),
                        username: localStorage.getItem("Username"),
                        Role: "member",
                        status: 0
                    })
                });

                const joinData = await joinRes.json();

                if (joinData.message !== "Joined successfully") {
                    console.log("DB join failed");
                    return;
                }

                console.log("DB join success");

                socket.emit(
                    "joinRoom",
                    localStorage.getItem("Roomname"),
                    localStorage.getItem("Username")
                );

                const response = await fetch("https://cinesync-3k1z.onrender.com/getAllParticipants", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        roomName: localStorage.getItem("Roomname"),
                        userName: localStorage.getItem("Username")
                    })
                });

                const data = await response.json();

                setConnectedMemebers(data.allmembers || []);

            } catch (err) {

                console.log(err);

            }

        }

        initRoom();

        socket.on("newJoin", (id,username) => {

            setConnectedMemebers(prev => {

                const exists = prev.some(
                    member => member.username === friend
                );

                if (exists) return prev;

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
    useEffect(() => {
        socket.on("partystarted", () => {
            console.log("Party started received");
            navigate("/mainRoom");
        });
        return () => {
            socket.off("partystarted");
        };
    }, []);

    return <>
        <SideBar></SideBar>
        <div className="waitingRoomMain">
            <Lobbymembers connectedMembers={connectedMembers}></Lobbymembers>
            <WaitingMain></WaitingMain>
            <LobbyChat></LobbyChat>
        </div>
    </>
}
