export default function InteractiveFeatures({audio,setAudio,video,setVideo,reaction,setReaction,chat,setChat}){
    return (
        <>
        <h6>INTERACTIVE FEATURES</h6>
            <div className="features">
                <div className="aboutFeature">
                    <div className="featureName">
                        <h2>Controls</h2>
                        <p>Host can only controls the video controls</p>
                    </div>
                    {audio?<i className="fa-solid fa-toggle-on" onClick={()=>setAudio(false)}></i>:<i className="fa-solid fa-toggle-off" onClick={()=>setAudio(true)}></i>}
                </div>
            </div>
        </>
    )
}