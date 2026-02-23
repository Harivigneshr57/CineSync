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
    const [controls,setControls]=useState(true);
    let vdoSrc = "";

      useEffect(()=>{
        const timer=setTimeout(()=>{
            setControls(false);
        },6000)
      },[]);
    
    // document.querySelector("video").muted=false;
    if (!movie) {
        console.log("User not found");
    }
    console.log("==============================");

    console.log(movie);

    vdoSrc = movie.movie_url;
    console.log("==============================");
    // console.log(vdoSrc);

    // console.log("==============================");

    console.log(movie);
    return (
        // <h1>Hii</h1>
        // <SampleSingle></SampleSingle>
        <div onMouseMove={()=>setControls(true)} id="singleMoviePage">
            <video id="bg-video" ref={videoRef} autoPlay>
                <source src={movie.video}></source>
            </video>
            <div style={{display:controls?"flex":"none"}} id="content_single">
                <SingleMovieTop movieName={movie.title}></SingleMovieTop>
                <div>

                    <VideoControls reference={videoRef}></VideoControls>
                </div>
            </div>
        </div>
    )
}
