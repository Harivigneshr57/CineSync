import { useRef } from "react";
import SingleMovieBottom from "./SingleMovieBottom";
import SingleMovieTop from "./SingleMovieTop";
import VideoControls from "./VideoControls";
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
        "CaptainAmerica:TheFirstAvenger":'https://movies-video-development.zohostratus.in/Videos/Eleven.webm',
        "TheAvengers":'https://movies-video-development.zohostratus.in/Parking.mp4',
        "Asuran":'httpshttps://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Titanic":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Thor:TheDarkWorld":'https://movies-video-development.zohostratus.in/Videos/Thor_2_The_Dark_World_2011_Tamil_Telugu_Hindi_English_Blu_Ray_1080p.mkv',
        "TheConjuring":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "GaurdiansOfTheGalaxy":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "TheConjuring2":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "CaptainAmerica:TheWinterSoldier":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "SitaRamam":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "HeySinamika":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "HiNanna":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "MiddleClass":'https://movies-video-development.zohostratus.in/Videos/Middle Class (2025) Tamil TRUE WEB-DL - 1080p - AVC - (D.mkv',
        "Fail":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "PariyerumPerumal":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Premalu":'https://movies-video-development.zohostratus.in/Videos/Premalu_2024_Tamil_Full_Movie_720p_HDRip_(isaimini.com.es).mp4',
        "Kiss":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Parking":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "OhMyKadavule":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Sirai":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Eleven":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Maara":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Meiyazhagan":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "ParandhuPo":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Madharasi":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Aan Paavam Pollathathu":'https://res.cloudinary.com/dsike2jgr/video/upload/v1771347813/Captain_America_Lifts_Thor_s_Hammer_Mjolnir_Scene_-_AVENGERS_4_ENDGAME_2019_Movie_CLIP_4K_720p60_dtynvl.mp4',
        "Avengers Endgame":"https://movies-video-development.zohostratus.in/Videos/@MM_Linkz The Conjuring 2 (2016) Tamil Dubbed HDRIp.mp4"
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
