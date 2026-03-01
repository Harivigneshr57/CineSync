import { useContext } from "react";
import MovieCard from "./../Discover/MovieCard";
import { UserContext } from "../Login-SignIn/UserContext";
import { useState,useEffect } from "react";
 

 
function Favourites(){
const {user}=useContext(UserContext);
const [movies,setMovies]=useState([]);
useEffect(()=>{
    const fetchFavorite=async()=>{
        await fetch("https://cinesync-3k1z.onrender.com/getMyFavoriteMovie",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username:user.username})
        }).then((res)=>res.json())
        .then((data)=>{
            console.log("console panni paaru");
            console.log(data);
            setMovies(data.result);
        })
    }

    fetchFavorite();
},[user]);



return <>
        <div className="favouritesection">
            <div className="recent-head">
                <div className="point-mark"></div>
                <h2 style={{ marginBottom: "1rem" }}>Favourites</h2>
            </div>
            <div id="movieitems" >
            {movies && movies.length > 0 ? (
    movies.map((movie) => (
        <MovieCard
            key={movie.title}
            url={movie.movie_poster}
            title={movie.title}
            genre=""
            year={movie.year}
            setOverview=""
            setOverviewMovie=""
            video=""
            lead={movie.lead_cast}
            director={movie.director}
            description={movie.overview}
            rating={movie.rating}
        />
    ))
) : <div id="no-member">
    <h3>Favorites Not Found</h3>
    </div>}
            </div>
        </div>
        </>
    }
 
export default Favourites; 