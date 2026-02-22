import { useState } from "react";
import VideoControl from "./VideoControl";
import Chat from "./Chat";
import Participants from "./Participants";
export default function VideoArea({reference,references}){
    const [chat,setChat] = useState(false);
    const [close,setClose] = useState(false);
    return(
        <>
            <div className="videoArea" ref={references}>
                <video ref={reference} src='https://movies-video-development.zohostratus.in/Videos/Oh My Kadavule (2020) Tamil 720p HDRip 1.3GB.mkv' autoPlay></video>
                <VideoControl reference={reference} references={references} setClose={setClose} setChat={setChat} chat={chat} close={close}></VideoControl>
                <Chat chat={chat} setChat={setChat} close={close} setClose={setClose}></Chat>
                <Participants chat={chat} setChat={setChat} close={close} setClose={setClose}></Participants>
            </div>
        </>
    )
}

// gardians of the galaxy

// Hey sinamika

// Hi nanna

// 12th Fail

// Maara

// Asuran

// Meiazhagan

// Paranthu Poo

// Madharasi

// Aan Pavam Pollathathu