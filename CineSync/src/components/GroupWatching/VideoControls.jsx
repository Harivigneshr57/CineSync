import { useEffect,useState } from "react";
export default function VideoControls({reference,chatOpen}){


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
<div className="controls-wrapper">

{/* Progress bar (top thin line) */}
<input
  type="range"
  className="top-progress"
  min={0}
  max={100}
  value={
    reference.current
      ? (reference.current.currentTime /
          reference.current.duration) *
        100 || 0
      : 0
  }
  onChange={movementOfRange}
/>

<div className="controls-bar">

  {/* Left Section */}
  <div className="left-controls">
    <button onClick={isPlaying ? vdopause : vdoplay} className="play-btn">
      <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`} />
    </button>

    <i className="fa-solid fa-volume-high volume-icon"></i>
    <input type="range" className="volume-slider" />
  </div>

  {/* Center Time */}
  <div className="time-display">
    {currentTime} / {duration}
  </div>

  {/* Right Section */}
  <div className="right-controls">
    <i className="fa-solid fa-gear icon-btn"></i>
    <i className="fa-solid fa-expand icon-btn"></i>
  </div>

</div>

{/* Reaction floating pill */}
<div className="reaction-pill">
  😂 ❤️ 👏 🔥
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
