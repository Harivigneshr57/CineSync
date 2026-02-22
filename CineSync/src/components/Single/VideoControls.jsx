import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { UserContext } from "../Login-SignIn/UserContext";
import { useNavigate } from "react-router-dom";
export default function VideoControls({ reference }) {

  const { user } = useContext(UserContext);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [isPlaying, setPlaying] = useState(false);
  const [videoRange, setVideoRange] = useState(0);
  const [videoVol, setvideoVol] = useState(0);
  const [showSpeed, setShowSpeed] = useState(false);
  const [speed, setSpeed] = useState(1); 

  const speedMap = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  // const toastErrorStyle = {
  //   style: {
  //     borderRadius: "1rem",
  //     background: "var(--error)",
  //     color: "white",
  //     fontWeight: 600,
  //     minWidth: "26rem",
  //   },
  //   iconTheme: {
  //     fontWeight: 600,
  //     secondary: "var(--white)",
  //   },
  // };
  // const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("user in effect:", user);
  //   if (!user || user.username == "") {
  //     const timer = setTimeout(() => {
  //       console.log("Redirecting to /home now");
  //       navigate("/");
  //       toast.error("User Not Found", toastErrorStyle);

  //     }, 6000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [user, navigate]);
  useEffect(() => {
    function handlekeydown(event) {
      console.log(event);
      const video = reference.current;
      if (!video) return;
  
      if (event.key === " ") {
       
        isPlaying ? vdopause() : vdoplay();
      } 
      else if (event.key === "ArrowLeft") {
        video.currentTime -= 10;
      } 
      else if (event.key === "ArrowRight") {
        video.currentTime += 10;
      }
      else if (event.key ==="ArrowUp" ){
        if(videoVol >=90||video.volume>=0.9){
          return;
        }
        let vivol=Math.min(video.volume +0.1||1);
        video.volume=vivol;
        setvideoVol(vivol*100);
      
      }
      else if (event.key ==="ArrowDown"){
        if(videoVol <=10||video.volume<=0.1){
          return;
        }
       
        let vivol=Math.max(video.volume -0.1||0);
        video.volume=vivol;
        setvideoVol(vivol*100);
      }
    }  
    window.addEventListener("keydown", handlekeydown);
  
    return () => {
      window.removeEventListener("keydown", handlekeydown);
    };
  }, [isPlaying,reference]);
useEffect(()=>{
  console.log(videoVol)
},[videoVol]);
  useEffect(() => {
    const video = reference.current;
    if (!video) return;
    function updateTime() {

      let range = ((video.currentTime / video.duration) * 100);
      // console.log(range);
      setVideoRange(range);
      setCurrentTime(formatTime(video.currentTime));
    }
    function loaded() {
      setDuration(formatTime(video.duration));
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", loaded);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", loaded);
    }

  }, [reference]);
  return (
    <div className="controls-wrapper">

      {/* Progress bar (top thin line) */}
      <div id="mainIp">
        <input type="range" className="top-progress" min={0} max={100} value={reference.current ? (reference.current.currentTime / reference.current.duration) * 100 || 0 : 0} onChange={movementOfRange} />
        <div id="backColorDiv" style={{ background: `linear-gradient(90deg,var(--major) ${videoRange}%,white ${videoRange}%)` }}></div>
      </div>


      <div className="controls-bar">

        {/* Left Section */}
        <div className="left-controls">
          <p onClick={() => reference.current.currentTime -= 10}><i class="fa-solid fa-angles-left"></i></p>
          <button onClick={isPlaying ? vdopause : vdoplay} className="play-btn">
            <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`} />
          </button>


          <p onClick={() => reference.current.currentTime += 10} >< i class="fa-solid fa-angles-right"></i></p>
        </div>

        {/* Center Time */}
        <div className="time-display">
          {currentTime} / {duration}
        </div>
        <div className="right-controls">
          <i style={{ color: "white", cursor: "pointer" }} onClick={toggleMute} className={`fa-solid ${videoVol === 0 ? "fa-volume-xmark" : "fa-volume-high"} volume-icon`} />

          <div style={{ position: "relative" }}>
            <input type="range" className="volume-slider" min={0} max={100} value={videoVol} onChange={movementOfVolume} />
            <div className="volume-fill" style={{ background: `linear-gradient(90deg,var(--major) ${videoVol}%,white ${videoVol}%)` }}></div>
          </div>
          <div className="speedDropDownDiv" onMouseEnter={() => setShowSpeed(true)} onMouseLeave={() => setShowSpeed(false)} >

            <i style={{ color: "white" }} class="fa-regular fa-clock"></i>
            {showSpeed && (<div onMouseEnter={() => setShowSpeed(true)} className="speedDropDownContainer">
              {speedMap.map((speedval) => {
                return <div onClick={() => {
                  changeSpeed(speedval);
                  setShowSpeed(false);
                }} className="singleSpeedval">{speedval}X</div>
              })}
            </div>)}
          </div>

        </div>
      </div>
    </div>
  )

  function vdoplay() {
    const video = reference.current;
    if (!video) return;

    video.play();
    setPlaying(true);
  }

  function vdopause() {
    const video = reference.current;
    if (!video) return;

    video.pause();
    setPlaying(false);

  }
  function changeSpeed(val) {
    const video = reference.current;
    if (!video) return;

    video.playbackRate = val;
    setSpeed(val);

  }
  function movementOfRange(e) {

    const video = reference.current;
    if (!isFinite(video.duration) || video.duration === 0) {
      console.log("Video duration not ready");
      return;
    }

    video.currentTime = (e.target.value / 100) * video.duration;
    let range = ((reference.current.currentTime / reference.current.duration) * 100);
    // console.log(range);
    setVideoRange(range);

  }

  function movementOfVolume(e) {
    const video = reference.current;
    if (!video) return;

    const newVolume = e.target.value / 100;

    video.muted = false;
    video.volume = newVolume;

    setvideoVol(newVolume * 100);
  }

  function toggleMute() {
    const video = reference.current;
    if (!video) return;

    if (video.muted || video.volume === 0) {
      video.muted = false;
      video.volume = 0.2;
      setvideoVol(20);

    } else {
      video.muted = true;
      setvideoVol(0);
    }
  }


}
function formatTime(timevalue) {
  const min = Math.floor(timevalue / 60);
  const sec = Math.floor(timevalue % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`
}
