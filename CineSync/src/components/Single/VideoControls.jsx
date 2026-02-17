import { useEffect,useState } from "react";
export default function VideoControls({reference}){


    const[currentTime,setCurrentTime]=useState("00:00");
    const[duration,setDuration]=useState("00:00");
    const[isPlaying,setPlaying]=useState(true);

    useEffect(()=>{
        const video=reference.current;
        if(!video) return;

        function updateTime(){
            setCurrentTime(formatTime(video.currentTime));
        }
        function loaded(){
            setDuration(formatTime(video.duration));
        };

        video.addEventListener("timeupdate",updateTime);
        video.addEventListener("loadedmetadata",loaded);


        return()=>{
            video.removeEventListener("timeupdate",updateTime);
            video.removeEventListener("loadedmetadata",loaded);
        }
    },[reference]);

    return(
        <div id="vc">
         
            <div id="video_control">
            <i onClick={vdoplay} id="playbut" style={{display:isPlaying?"none":"block"}}className="fa-solid fa-play"></i>
            <i onClick={vdopause}id="pausebut"style={{display:isPlaying?"block":"none"}} className="fa-solid fa-pause"></i>
            <p className="time" id="current_time">{currentTime}</p>
                <input onChange={movementOfRange} type="range" id="playback"min={0} max={100} value={reference.current?(reference.current.currentTime/reference.current.duration)*100:0}></input>
            <p className="time" id="total_time">{duration}</p>
            </div>
        </div>
    )

    function vdoplay(){
        reference.current.play();
        setPlaying(true);
    }

    function vdopause(){
        reference.current.pause();
        setPlaying(false);
        
    }

    function movementOfRange(e){
        const video=reference.current;
        if (!isFinite(video.duration) || video.duration === 0) {
            console.log("Video duration not ready");
            return;
        }
    
        video.currentTime=(e.target.value/100)*video.duration;       
    }
}
function formatTime(timevalue){
    const min=Math.floor(timevalue/60);
    const sec=Math.floor(timevalue%60);
    return `${min}:${sec <10?"0":""}${sec}`
}
