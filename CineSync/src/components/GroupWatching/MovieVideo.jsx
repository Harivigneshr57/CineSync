import VideoControls from "./VideoControls"
import RoomChat from "./RoomChat";
import { useRef, useState } from "react";
export default function MovieVideo(){
    const [chatOpen,setOpen] = useState(true);
    let video = useRef(null);
    return(
        <>
        <div className="video-area">
            <video src={'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4'} id="roomMovie" autoPlay muted style={chatOpen?{width:'100%'}:{width:'80%'}} ref={video}></video>
            <VideoControls chatOpen={chatOpen} reference={video} />
            <RoomChat setOpen={setOpen} chatOpen={chatOpen}></RoomChat>
        </div>
        </>
    )
}