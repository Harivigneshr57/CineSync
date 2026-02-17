import bigMovie from '../../assets/bigMovie.png'
import Button from "../Login-SignIn/Button";
export default function BigMovie(){
    return(
        <>
            <div className="bigMovieContainer" style={{backgroundImage: `linear-gradient(to top,rgba(0,0,0,0.85), rgba(0,0,0,0.2), rgba(0,0,0,0)),url(${bigMovie})`}}>
                <section>
                    <div className="premieres">
                        <div className="tonight">
                            PREMIERES TONIGHT
                        </div>
                        <p>Action • Sci-Fi • 2h 45m</p>
                    </div>
                    <div className="movieName">
                        <h1>THE MIDNIGHT</h1>
                        <h1>ODYSSEY</h1>
                    </div>
                    <div className="movieDesc">
                        A celestial anomaly threatens the fabric of time. Experience the breathtaking visual masterpiece with your circle in real-time.
                    </div>
                    <div className="watchButtons">
                        <Button icon={<i className="fa-solid fa-users"></i>} id={"friendWatch"}> Watch with Friends</Button>
                        <Button icon={<i className="fa-solid fa-play"></i>} id={"soloPlay"}>play</Button>
                    </div>
                </section>
            </div>
        </>
    )
}