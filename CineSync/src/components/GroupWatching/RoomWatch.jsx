import { useRef, useState } from "react";
import SideBar from "../Home/SideBar";
import TopBar from "./Topbar";
import VideoArea from "./VideoArea";
import './group.css';
import Chat from "./Chat";
import Participants from "./Participants";
export default function RoomWatch(){
    const [chat,setChat] = useState(false);
    let video = useRef(null);
    let container = useRef(null);
    return(
    <>
        <div className="roomWatch">
            <SideBar></SideBar>
            <TopBar></TopBar>
            <VideoArea reference={video} references={container} chat={chat} setChat={setChat}></VideoArea>
            <Chat chat={chat} setChat={setChat}></Chat>
            <Participants chat={chat} setChat={setChat}></Participants>
        </div>
    </>
    )
}