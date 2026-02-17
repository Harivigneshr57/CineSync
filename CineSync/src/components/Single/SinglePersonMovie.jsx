import { useRef } from "react";
import SingleMovieBottom from "./SingleMovieBottom";
import SingleMovieTop from "./SingleMovieTop";
import VideoControls from "./VideoControls";
import "./singleMovie.css";
// import captain from "./Wheels on the Bus.mp4";
import captain from './Asuran.mp4';

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Login-SignIn/UserContext";

export default function SinglePersonMovie() {
    const videoRef = useRef(null);
    const { movie } = useContext(UserContext);
    let vdoSrc="";

    // document.querySelector("video").muted=false;
    if( !movie){
        console.log("User not found");
    }
    console.log("==============================");

    console.log(movie);

    vdoSrc=movie.movie_url;
    console.log("==============================");
    // console.log(vdoSrc);

    // console.log("==============================");

    const videoMap = {
        "CaptainAmerica:TheFirstAvenger":captain,
        "TheAvengers":captain,
        "Asuran":captain
    }

    return (
        // <h1>Hii</h1>
        // <SampleSingle></SampleSingle>
        <div id="singleMoviePage">
               <video id="bg-video" ref={videoRef} autoPlay muted >
                <source src={videoMap[movie.title]}></source>
            </video>
            <div id="content_single">
            <SingleMovieTop movieName={movie.title}></SingleMovieTop>
            <div>

        <VideoControls reference={videoRef}></VideoControls>
            <SingleMovieBottom></SingleMovieBottom>
            </div>
            </div>       
        </div>
    )
}
