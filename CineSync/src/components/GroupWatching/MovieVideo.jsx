import VideoControls from "./VideoControls"
import Asuran from '../Single/Wheels on the Bus.mp4';
import RoomChat from "./RoomChat";
import { useRef, useState } from "react";
export default function MovieVideo(){
    const [chatOpen,setOpen] = useState(true);
    let video = useRef(null);
    return(
        <>
        <div className="video-area">
            <video src={Asuran} id="roomMovie" autoPlay muted style={chatOpen?{width:'100%'}:{width:'80%'}} ref={video}></video>
            <VideoControls chatOpen={chatOpen} reference={video} />
            <RoomChat setOpen={setOpen} chatOpen={chatOpen}></RoomChat>
        </div>
        </>
    )
}