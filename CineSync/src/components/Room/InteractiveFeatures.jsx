export default function InteractiveFeatures({audio,setAudio,video,setVideo,reaction,setReaction,chat,setChat}){
    return (
        <>
        <h6>INTERACTIVE FEATURES</h6>
            <div className="features">
                <div className="aboutFeature">
                    <div className="featureName">
                        <h2>Audio Call</h2>
                        <p>Enable real-time audio interaction</p>
                    </div>
                    {audio?<i className="fa-solid fa-toggle-on" onClick={()=>setAudio(false)}></i>:<i className="fa-solid fa-toggle-off" onClick={()=>setAudio(true)}></i>}
                </div>
                <div className="aboutFeature">
                    <div className="featureName">
                        <h2>Video Call</h2>
                        <p>Enable real-time video interaction</p>
                    </div>
                    {video?<i className="fa-solid fa-toggle-on" onClick={()=>setVideo(false)}></i>:<i className="fa-solid fa-toggle-off" onClick={()=>setVideo(true)}></i>}
                </div>
                <div className="aboutFeature">
                    <div className="featureName">
                        <h2>Synchronized Emoji Reactions</h2>
                        <p>See everyone's floating reactions instantly</p>
                    </div>
                    {reaction?<i className="fa-solid fa-toggle-on" onClick={()=>setReaction(false)}></i>:<i className="fa-solid fa-toggle-off" onClick={()=>setReaction(true)}></i>}
                </div>
                <div className="aboutFeature">
                    <div className="featureName">
                        <h2>Live Chat</h2>
                        <p>Side Panel Chat interaction</p>
                    </div>
                    {chat?<i className="fa-solid fa-toggle-on" onClick={()=>setChat(false)}></i>:<i className="fa-solid fa-toggle-off" onClick={()=>setChat(true)}></i>}
                </div>
            </div>
        </>
    )
}