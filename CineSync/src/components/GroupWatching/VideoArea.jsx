import { useContext, useEffect, useRef } from "react";
import { socket } from "../Home/socket";
import VideoControl from "./VideoControl";
import { UserContext } from "../Login-SignIn/UserContext";

export default function VideoArea({ reference, references, chat, setChat,party,setParty,micOn,setMicOn,camOn,setCamOn,mutedUsers,setMutedUsers,localVideo }) {
    const roomVideo = localStorage.getItem('movieVideo'); 
    const isRemoteSeek = useRef(false);
    const roomName = localStorage.getItem("Roomname");

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

    return (
        <div
            className="videoArea"
            ref={references}
            style={chat||party ? { width: '76%' } : { width: '96%' }}
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
            />

        </div>
    );
}