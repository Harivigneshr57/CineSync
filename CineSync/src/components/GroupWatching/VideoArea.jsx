import { useContext, useEffect, useState, useRef } from "react";
import { socket } from "../Home/socket";
import VideoControl from "./VideoControl";
import { UserContext } from "../Login-SignIn/UserContext";

export default function VideoArea({ reference, references, chat, setChat,party,setParty,micOn,setMicOn,camOn,setCamOn,mutedUsers,setMutedUsers,localVideo }) {
    const roomVideo = localStorage.getItem('movieVideo'); 
    const isRemoteSeek = useRef(false);
    const roomName = localStorage.getItem("Roomname");
    const [showControls, setShowControls] = useState(true);
    const hideControlsTimer = useRef(null);

    function scheduleControlsHide() {
        if (hideControlsTimer.current) {
            clearTimeout(hideControlsTimer.current);
        }

        hideControlsTimer.current = setTimeout(() => {
            setShowControls(false);
        }, 5000);
    }

    function handleControlsActivity() {
        setShowControls(true);
        scheduleControlsHide();
    }

    function emitSeek(time) {

        if (isRemoteSeek.current) {
            isRemoteSeek.current = false;
            return;
        }

        socket.emit("VideoSeek", {
            room: roomName,
            time: time
        });
    }

    useEffect(() => {

        socket.on("updateSeek", (time) => {

            isRemoteSeek.current = true;

            reference.current.currentTime = time;
        });

        return () => socket.off("updateSeek");

    }, []);

    useEffect(() => {
        scheduleControlsHide();

        return () => {
            if (hideControlsTimer.current) {
                clearTimeout(hideControlsTimer.current);
            }
        };
    }, []);

    return (
        <div
            className="videoArea"
            ref={references}
            style={chat||party ? { width: '76%' } : { width: '96%' }}
            onMouseMove={handleControlsActivity}
            onClick={handleControlsActivity}
            onTouchStart={handleControlsActivity}
        >

            <video
                ref={reference}
                autoPlay
                controls={false}
                onSeeked={() => emitSeek(reference.current.currentTime)}
                src={roomVideo}
            />

                <VideoControl
                    reference={reference}
                    references={references}
                    setChat={setChat}
                    chat={chat}
                    emitSeek={emitSeek}
                    party={party}
                    setParty={setParty}
                    micOn={micOn}
                    setMicOn={setMicOn} 
                    camOn={camOn} 
                    setCamOn={setCamOn} 
                    mutedUsers={mutedUsers} 
                    setMutedUsers={setMutedUsers}
                    localVideo={localVideo}
                    showControls={showControls}
                />

        </div>
    );
}