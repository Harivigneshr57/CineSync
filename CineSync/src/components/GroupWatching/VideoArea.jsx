import VideoControl from "./VideoControl";
export default function VideoArea({reference,references}){
    return(
        <>
            <div className="videoArea" ref={references}>
                <video ref={reference} src='https://movies-video-development.zohostratus.in/Videos/Eleven.webm' autoPlay></video>
                <VideoControl reference={reference} references={references}></VideoControl>
            </div>
        </>
    )
}