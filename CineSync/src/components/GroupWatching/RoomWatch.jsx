import { useRef, useState } from "react";
import SideBar from "../Home/SideBar";
import TopBar from "./Topbar";
import VideoArea from "./VideoArea";
import './group.css';
import Chat from "./Chat";
import Participants from "./Participants";
import { socket } from "../Home/socket";
import { useEffect } from "react";

export default function RoomWatch() {
    const [chat, setChat] = useState(false);
    let video = useRef(null);
    let container = useRef(null);

    const [currentmessage, setmessage] = useState("");
    const [allmessages, setmessages] = useState([]);

    const chatBoxRef = useRef(null);

    const room = localStorage.getItem("Roomname");
    const username = localStorage.getItem("Username");

    function sendMessageToRoom() {
        console.log("Message: "+currentmessage)
        if (!currentmessage.trim()) return;

        const msgObj = {
            message: currentmessage,
            role: username
        };

        setmessages(prev => [...prev, msgObj]);

        socket.emit(
            "sendMessageInsideRoom",
            room,
            {
                message: currentmessage,
                role: username
            }
        );

        setmessage("");
    }


    useEffect(() => {

        socket.on("messageFromRoom", (msgObj) => {
            setmessages(prev => [...prev, msgObj]);
        });
        return () => {
            socket.off("messageFromRoom");
        };
    }, []);


    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop =
                chatBoxRef.current.scrollHeight;
        }
    }, [allmessages]);

    return (
        <>
            <div className="roomWatch">
                <SideBar></SideBar>
                <TopBar></TopBar>
                <VideoArea reference={video} references={container} chat={chat} setChat={setChat}></VideoArea>
                <Chat allmessages = {allmessages}chat={chat}setmessage={setmessage} setChat={setChat} chatBoxRef ={chatBoxRef} sendMessageToRoom={sendMessageToRoom}>
                </Chat>
                <Participants chat={chat} setChat={setChat}></Participants>
            </div>
        </>
    )
}
