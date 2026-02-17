import TrendingContainer from "./TrendingMovieContainer";
import movie1 from "../../assets/Avenger.png";
import movie2 from "../../assets/SpiderMan.png";
import movie3 from "../../assets/KGF.png";
import movie4 from "../../assets/Tmovie1.png";
import movie6 from "../../assets/Thunivu.png"
import movie5 from "../../assets/Master.png";


export default function TrendingNow(){ 
    let trendingMovies = [movie1, movie2, movie3, movie4, movie6, movie5];
    return(
        <>
            <div className="trending flex">
                <div className="trendingNow">
                    <h2>Trending Now</h2>
                    <div className="trendingMovieList">
                        {trendingMovies.map((a,i)=>{
                            return (<TrendingContainer key={i} src={a}></TrendingContainer>)
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}