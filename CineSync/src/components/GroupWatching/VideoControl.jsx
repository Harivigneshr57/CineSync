import { useEffect, useState } from "react";
import Button from "../Login-SignIn/Button";

export default function VideoControl({ reference, references,chat,setChat }) {

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

    return `${hour}:${min < 10 ? "0" : ""}${min}:${
      sec < 10 ? "0" : ""
    }${sec}`;
  }

  const [currentTime, setCurrentTime] = useState("00:00:00");
  const [duration, setDuration] = useState("00:00:00");
  const [videoRange, setVideoRange] = useState(0);
  const [pause, setPause] = useState(true);
  const [mute, setMute] = useState(false);
  const [videoVol, setvideoVol] = useState(75);
  const [fullscreens,setFullScreen] = useState(true);

  useEffect(() => {
    const video = reference.current;
    if (!video) return;

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
    };
  }, [reference]);

  function pauses() {
    const video = reference.current;
    if (!video) return;

    setPause(prev => {
      if (prev) video.pause();
      else video.play();
      return !prev;
    });
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
    video.currentTime = (value / 100) * video.duration;
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

  function roomChat(){
    setChat(true);
  }
  return (
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
            {pause ? (
              <i className="fa-solid fa-pause"></i>
            ) : (
              <i className="fa-solid fa-play"></i>
            )}
          </Button>

          <Button id={"forward"} onClick={forward}>
            <i className="fa-solid fa-forward"></i>
          </Button>

          <div className="callOptions">
            <Button id={"audio"}>
              <i className="fa-solid fa-microphone"></i>
            </Button>

            <Button id={"video"}>
              <i className="fa-solid fa-video"></i>
            </Button>
          </div>

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

        <div className="rightSide">
          <Button id={"roomChats"} onClick={roomChat} style={chat?{background:"var(--major)"}:{background:"var(--background)"}}>
            <i className="fa-solid fa-message"></i> Chat
          </Button>
          <Button id={"roomParticipants"}>
            <i class="fa-solid fa-people-group"></i> Video
          </Button>
          <div className="horizontaline"></div>
          {fullscreens?<i class="fa-solid fa-expand" onClick={toggleFullscreen}></i>:<i class="fa-solid fa-compress" onClick={toggleFullscreen}></i>}
        </div>
      </div>
    </div>
  );
}
