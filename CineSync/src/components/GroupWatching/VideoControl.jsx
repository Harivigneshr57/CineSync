import { useEffect, useState, useRef } from "react";
import Button from "../Login-SignIn/Button";
import { socket } from "../Home/socket";
import FloatingEmoji from "./FloatingEmoji";
export default function VideoControl({reference, references,chat,setChat,emitSeek,party,setParty,micOn,setMicOn,camOn,setCamOn,mutedUsers,setMutedUsers,localVideo}) {

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      references.current.requestFullscreen();
      setFullScreen(false);
    } else {
      document.exitFullscreen();
      setFullScreen(true);
    }
  }

  function formatTime(timevalue) {
    if (!timevalue || !isFinite(timevalue)) {
      return "00:00:00";
    }

    const hour = Math.floor(timevalue / 3600);
    const min = Math.floor((timevalue % 3600) / 60);
    const sec = Math.floor(timevalue % 60);

    return `${hour}:${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""
      }${sec}`;
  }

  const [currentTime, setCurrentTime] = useState("00:00:00");
  const [duration, setDuration] = useState("00:00:00");
  const [videoRange, setVideoRange] = useState(0);
  const [play, setPlay] = useState(true);
  const [mute, setMute] = useState(false);
  const [videoVol, setvideoVol] = useState(75);
  const [fullscreens, setFullScreen] = useState(true);
  const[emojis, setEmoji]=useState([]);

  useEffect(() => {
    const video = reference.current;
    if (!video) return;

    socket.on("pauseTheVideo", () => {
      console.log("Remote pause received");

      video.pause();
      setPlay(false);
    });

    socket.on("playTheVideo", () => {
      console.log("Remote play received");

      video.play();
      setPlay(true);
    });

    function updateTime() {
      if (!video.duration) return;

      const range = (video.currentTime / video.duration) * 100;
      setVideoRange(range);
      setCurrentTime(formatTime(video.currentTime));
    }

    function loaded() {
      setDuration(formatTime(video.duration));
    }

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", loaded);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", loaded);
      socket.off("pauseTheVideo");
      socket.off("playTheVideo");
    };
  }, [reference]);

  function pauses() {
    const video = reference.current;
    if (!video) return;

    if (!video.paused) {
      video.pause();
      setPlay(false);

      socket.emit(
        "VideoPaused",
        localStorage.getItem("Roomname"),
        localStorage.getItem("Username")
      );
    } else {
      video.play();
      setPlay(true);

      socket.emit(
        "VideoPlayed",
        localStorage.getItem("Roomname"),
        localStorage.getItem("Username")
      );
    }
  }

  function forward() {
    const video = reference.current;
    if (video) video.currentTime += 10;
  }

  function backward() {
    const video = reference.current;
    if (video) video.currentTime -= 10;
  }

  function movementOfRange(e) {

    const video = reference.current;
    if (!video || !video.duration) return;
    const value = e.target.value;
    const newTime = (value / 100) * video.duration;
    video.currentTime = newTime;
    emitSeek(newTime);
    setVideoRange(value);
  }

  function movementOfVolume(e) {
    const video = reference.current;
    if (!video) return;

    const newVolume = e.target.value / 100;

    video.volume = newVolume;
    video.muted = newVolume === 0;

    setvideoVol(newVolume * 100);
    setMute(newVolume === 0);
  }

  function roomChat() {
    setChat(true);
    setParty(false);
  }

  function roomParty(){
    setParty(true);
    setChat(false)
  }

  const isRemoteSeek = useRef(false);

  function handleSeek() {
    if (isRemoteSeek.current) {
      isRemoteSeek.current = false;
      return;
    }
    socket.emit("seek", {
      room: roomName,
      time: videoRef.current.currentTime
    });
  }

  function sendEmoji(emoji) {
    console.log("Hello",emoji);
    const newEmoji = {
      id: Date.now(),
      value: emoji
    };
    setEmoji(prev => [...prev, newEmoji]);
  
    socket.emit("sendEmoji", {
      room: roomName,
      emoji: emoji
    });
  }

  socket.on('receiveEmoji',emoji=>{
    sendEmoji(emoji);
  })

  function toggleMic() {
    const stream = localVideo?.current?.srcObject;
    const nextMicOn = !micOn;

    if (stream) {
      const track = stream.getAudioTracks()[0];
      if (track) {
        track.enabled = nextMicOn;
      }
    }

    if (reference?.current) {
      reference.current.muted = !nextMicOn;
    }

    setMicOn(nextMicOn);
  }
  
  function toggleCamera() {
    const stream = localVideo?.current?.srcObject;
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  }

  useEffect(() => {
    socket.on("seek", (time) => {
      isRemoteSeek.current = true;
      videoRef.current.currentTime = time;
    });

    return () => socket.off("seek");

  }, []);
  return (
    <>
    <FloatingEmoji emoji={emojis}></FloatingEmoji>
    <div className="videoControls">

      <div id="mainIp">
        <input
          type="range"
          className="top-progress"
          min={0}
          max={100}
          value={videoRange}
          onChange={movementOfRange}
        />

        <div
          id="backColorDiv"
          style={{
            background: `linear-gradient(
              90deg,
              var(--major) ${videoRange}%,
              white ${videoRange}%
            )`,
          }}
        />
      </div>

      <div className="otherControls">

        <div className="leftSide">

          <Button id={"backward"} onClick={backward}>
            <i className="fa-solid fa-backward"></i>
          </Button>

          <Button id={"pause"} onClick={pauses}>
            {play ? (
              <i className="fa-solid fa-pause"></i>
            ) : (
              <i className="fa-solid fa-play"></i>
            )}
          </Button>

          <Button id={"forward"} onClick={forward}>
            <i className="fa-solid fa-forward"></i>
          </Button>

          <p>{currentTime} / {duration}</p>

          <div className="volume">

            {mute ? (
              <i className="fa-solid fa-volume-xmark vol"></i>
            ) : (
              <i className="fa-solid fa-volume-high vol"></i>
            )}

            <div id="volumeIp">
              <input
                type="range"
                className="volume-slider"
                min={0}
                max={100}
                value={videoVol}
                onChange={movementOfVolume}
              />

              <div
                id="volColorDiv"
                style={{
                  background: `linear-gradient(
                    90deg,
                    var(--major) ${videoVol}%,
                    white ${videoVol}%
                  )`,
                }}
              />
            </div>

          </div>
        </div>
        <div className="emojiDiv">
          <h3 onClick={()=>sendEmoji('❤️')}>❤️</h3>
          <h3 onClick={()=>sendEmoji('😂')}>😂</h3>
          <h3 onClick={()=>sendEmoji('😮')}>😮</h3>
          <h3 onClick={()=>sendEmoji('😢')}>😢</h3>
          <h3 onClick={()=>sendEmoji('😡')}>😡</h3>
        </div>
        <div className="callOptions">
            <Button id={"audio"} onClick={toggleMic} style={{background:micOn?'var(--major)':'var(--error)'}}>
              {micOn?<i className="fa-solid fa-microphone"></i>:<i class="fa-solid fa-microphone-slash"></i>}
            </Button>

            <Button id={"video"} onClick={toggleCamera} style={{background:camOn?'var(--major)':'var(--error)'}}>
              {camOn?<i className="fa-solid fa-video"></i>:<i class="fa-solid fa-video-slash"></i>}
            </Button>
          </div>
        <div className="rightSide">
          <Button id={"roomChats"} onClick={roomChat} style={chat ? { background: "var(--major)" } : { background: "var(--background)" }}>
            <i className="fa-solid fa-message"></i> Chat
          </Button>
          <Button id={"roomParticipants"} onClick={roomParty} style={party ? { background: "var(--major)" } : { background: "var(--background)" }}>
            <i class="fa-solid fa-people-group"></i> Video
          </Button>
          <div className="horizontaline"></div>
          {fullscreens ? <i class="fa-solid fa-expand" onClick={toggleFullscreen}></i> : <i class="fa-solid fa-compress" onClick={toggleFullscreen}></i>}
        </div>
      </div>
    </div>
    <FloatingEmoji emoji={emojis}></FloatingEmoji>
    </>
  );
}