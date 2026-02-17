import { useRef } from "react";
import SingleMovieBottom from "./SingleMovieBottom";
import SingleMovieTop from "./SingleMovieTop";
import VideoControls from "../GroupWatching/VideoControls";
import "./singleMovie.css";

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
        "CaptainAmerica:TheFirstAvenger":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "TheAvengers":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Asuran":'httpshttps://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4'
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
