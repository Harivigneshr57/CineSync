import Feature from "./Feature";

export default function FeatureComponent(){
    let data = [["Shared Watch Rooms","Host synchronized viewing parties with high-quality video and low-latency audio for the ultimate social experience.",<i className="fa-solid fa-people-group"></i>],
                ["Real-Time Sync","Perfectly synced playback engine. Pause, play, and seek for everyone in the room simultaneously.",<i className="fa-solid fa-arrows-rotate"></i>],
                ["Group Calls","Built-in high-definition voice and video chat so you can share every emotion instantly.",<i className="fa-solid fa-phone"></i>],
                ["AI Summaries","Missed a crucial plot point? Get instant AI-powered recaps of key moments in your private chat.",<i className="fa-solid fa-wand-magic-sparkles"></i>]]
    return(
        <>
        <div className="trending flex">
            <div className="trendingNow">
                <h2>More reasons to join</h2>
                <div className="trendingMovieList">
                    {data.map((a,i)=>{
                        return <Feature arr={a} key={i}></Feature>
                    })}
                </div>
            </div>
        </div>
        </>
    )
}