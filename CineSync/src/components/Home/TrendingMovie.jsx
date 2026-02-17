import movie1 from "../../assets/Avenger.png";
import movie2 from "../../assets/SpiderMan.png";
import movie3 from "../../assets/KGF.png";
import movie4 from "../../assets/Tmovie1.png";
import movie6 from "../../assets/Thunivu.png"
import movie5 from "../../assets/Master.png";
import Trending from "./Trending";
export default function TrendingMovie(){
    let arr = [
        [movie1,"Avengers"],[movie2,"SpiderMan"],[movie3,"KGF2"],[movie4,"Stranger Things"],[movie6,"Thunivu"],[movie5,"Master"]
    ]
    return(
        <>
            <div className="trendingMovies">
                <h2>Trending Movies</h2>
                <div className="trends">
                    {arr.map((a,i)=>{
                        return <Trending arr={a} key={i}></Trending> 
                    })}
                </div>
            </div>
        </>
    )
}