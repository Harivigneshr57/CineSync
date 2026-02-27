import Genre from "./Genre";
export default function AISummarizer() {

    let genries = ["Crime","Drama","Action"]
    return <>
        <div className="parent-summary">
            <div className="main-summary">
                <div className="summary-imageholder">
                    <img className="summary-movie-image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD39Rw-yrW0S1h4-oXlIPZeQntoi1jwavDgk2TqVNDB1bzTHyKGEqQ8LR1j2tQSjpYAPsScQHlTmYw8GlFm0luJmUCvem7cCHzW129Owa85n9Bj8Z9DUaMgrtcdv0CyElzb_ePde7wpSCDpviHWbJTEKhxUs43XhwAmU4WMqmwkEbS3F63eLQ4bUlBDuaVey36gst8bM07M4snsUj3Wf-UdO5f9RBKTolF5_gn3vdVhMbBAQWTlocaPdeTaS__6rJW4R1wApPaoTsc" alt="" />
                </div>
                <div className="movie-details">
                    <h3 className="movieName">Vada Chennai <span> (2018)</span></h3>
                    <div style={{ display: "flex", gap: "1rem"}} className="movie-top">
                        {genries.map((genre,i)=>{
                           return  <Genre genre={genre} key={i}></Genre>
                        })}
                    </div>
                    <div  className="tone-icon">
                        <p className="summary-tone"><i className="fa-regular fa-face-smile" id="icon"></i><span> Tone: Gritty, realistic, and intense</span></p>
                        <p className="summary-tone" style={{marginLeft:"1px"}}><i className="fa-solid fa-location-dot" id ="icon"></i><span> Setting: North Chennai, 1980s-early 2000s</span></p>
                    </div>
                    <hr />
                    <div className="plot-summary-main">
                        <div className="plot-summary-first">
                            <i className="fa-solid fa-clipboard-list" id="icon"></i><span> Plot summary</span>
                        </div>
                        <div>
                            <p className="plot-summary">
                                Anbu, a skilled carrom player, is drawn into the violent world of North Chennai's underworld. The narrative follows his evolution from an aspiring sportsman to a central figure in a long-standing gang war, navigating loyalty and betrayal.
                            </p>
                        </div>
                    </div>
                    <div className="plot-summary-main">
                        <div className="plot-summary-first">
                        <i className="fa-solid fa-down-left-and-up-right-to-center" id="icon"></i><span>Main Conflict
</span>
                        </div>
                        <div>
                            <p className="plot-summary">
                            The power struggle between rival gang leaders seeking control over North Chennai. Political ambitions and greed collide with the lives of local residents, forcing Anbu to choose a side in a battle that spans decades.
                            </p>
                        </div>
                    </div>
                    <div className="plot-summary-main">
                        <div className="plot-summary-first">
                            <i className="fa-solid fa-clipboard-list" id="icon"></i><span> Resolution</span>
                        </div>
                        <div>
                            <p className="plot-summary">
                                Anbu, a skilled carrom player, is drawn into the violent world of North Chennai's underworld. The narrative follows his evolution from an aspiring sportsman to a central figure in a long-standing gang war, navigating loyalty and betrayal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}