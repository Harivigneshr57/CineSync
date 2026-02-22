import VideoControl from "./VideoControl";
export default function VideoArea({reference,references, chat,setChat}){
    return(
        <>
            <div className="videoArea" ref={references} style={chat?{width:'76%'}:{width:'96%'}}>
                <video ref={reference} src='https://movies-video-development.zohostratus.in/Videos/Oh My Kadavule (2020) Tamil 720p HDRip 1.3GB.mkv' autoPlay></video>
                <VideoControl reference={reference} references={references}  setChat={setChat} chat={chat} ></VideoControl>
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