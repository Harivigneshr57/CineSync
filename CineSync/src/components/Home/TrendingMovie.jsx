import { useNavigate } from "react-router-dom";
import { UserContext } from "../Login-SignIn/UserContext";
import { useContext, useEffect, useState } from "react";
import OverView from "../Discover/Overview";
import MovieCard from "../Discover/MovieCard";

export default function TrendingMovie(){
    let nav = useNavigate();
    const { changeMovie } = useContext(UserContext);
    const {user} =useContext(UserContext);
    const [arr,setMovieArr]=useState([]);
    const [overview,setOverview] = useState(false);
    const [overviewMovie,setOverViewMovie] = useState({});

    function single(title){
        changeMovie("",title)
        nav('/single');
    }

    function overView(a){
        setOverViewMovie(a);
        setOverview(true);
    }

    useEffect(()=>{
        console.log("qwertyuiopudsdfghjkl;")
        const fetchTrending=async()=>{
            await fetch("https://cinesync-3k1z.onrender.com/getTrendingMovie")
            .then((res)=>res.json())
            .then((data)=>{
                console.log("----------------------");
                console.log(data.result);
                console.log("----------------------");

                setMovieArr(data.result);
            })
            .catch((err)=>console.log(err));
        }
        fetchTrending();
    },[user]);
    return(
        <>
            <div className="trendingMovies">
                <h2>Trending Movies</h2>
                <div className="trends">
                {arr.map((a, i) => {
                    return <MovieCard url={a.movie_poster} title={a.title} genre="" year={a.year} setOverview={setOverview} setOverviewMovie={setOverViewMovie} video={""} lead={a.lead_cast} director={a.director} description={a.overview} rating={a.rating} key={i} onClick={()=>overView(a)} />
})}
                </div>
            </div>
            <OverView overview={overview} overviewMovie={overviewMovie} setOverview={setOverview}></OverView>
        </>
    )
}