export default function InteractiveFeatures({ hostControl, setHostControl }){
    return (
        <>
        <h6>INTERACTIVE FEATURES</h6>
            <div className="features">
                <div className="aboutFeature">
                    <div className="featureName">
                        <h2>Controls</h2>
                        <p>Allow only host to control play, pause and seek</p>
                    </div>
                    {hostControl ? (
                        <i className="fa-solid fa-toggle-on" onClick={() => setHostControl(false)}></i>
                    ) : (
                        <i className="fa-solid fa-toggle-off" onClick={() => setHostControl(true)}></i>
                    )}
                </div>
            </div>
        </>
    )
}