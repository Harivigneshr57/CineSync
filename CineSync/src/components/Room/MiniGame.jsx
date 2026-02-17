export default function MiniGame({game,setGame}){
    return(
        <>
            <h6>MINI-GAMES</h6>
            <div className="features">
                <div className="aboutFeature">
                    <div className="featureName">
                        <h2>Predict What Happens Next</h2>
                        <p>Interactive polls during key cinematic moments</p>
                    </div>
                    {game?<i className="fa-solid fa-toggle-on" onClick={()=>{console.log("setGame off");setGame(false)}}></i>:<i className="fa-solid fa-toggle-off" onClick={()=>{console.log("setGame on");setGame(true)}}></i>}
                </div>
            </div>
        </>
    )
}