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

    if( !movie){
        console.log("User not found");
    }
    console.log("==============================");

    console.log(movie);

    vdoSrc=movie.movie_url;
    console.log("==============================");

    const videoMap = {
        "CaptainAmerica:TheFirstAvenger":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "TheAvengers":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Asuran":'httpshttps://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Titanic":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Thor:TheDarkWorld":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "TheConjuring":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "GaurdiansOfTheGalaxy":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "TheConjuring2":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "CaptainAmerica:TheWinterSoldier":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "SitaRamam":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "HeySinamika":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "HiNanna":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "MiddleClass":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Fail":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "PariyerumPerumal":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Premalu":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Kiss":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Parking":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "OhMyKadavule":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Sirai":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Eleven":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Maara":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Meiyazhagan":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "ParandhuPo":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Madharasi":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Aan Paavam Pollathathu":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4'
    }

    return (
        <div id="singleMoviePage">
               <video id="bg-video" ref={videoRef} autoPlay muted >
                <source src={videoMap[movie.title]||'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4'}></source>
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
