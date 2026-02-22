import { useEffect, useState } from "react";
import MovieCard from "../Discover/MovieCard";

export default function SingleMovieBottom(){
const[movieArr,setMovieArr]=useState([]);

useEffect(()=>{
  const fetching=async()=>{
    await fetch("http://localhost:3458/getAllMovies")
    .then((res)=>{
      return res.json();
    }).then((data)=>{
      console.log("Hi from Bottom");
      console.log(data);
      setMovieArr(data.movies);
    }).catch((err)=>console.log(err));
  }
  fetching();
},[]);
// async function val(){
//   await fetch("http://localhost:3458/getAllMovies")
//   .then((res)=>{
//     return res.json();
//   }).then((data)=>{
//     console.log("Hi from Bottom");
//     console.log(data);
//     setMovieArr(data.movies);
//   }).catch((err)=>console.log(err));
// }
// val();
    return(
        <div id="singleBottomDiv" >
           {
              movieArr.slice(0,7).map((movieobj,index)=>(
        <MovieCard key={index} title={movieobj.title}  genre={movieobj.Category_Name} year={movieobj.year}></MovieCard>
      ))
    }
        </div>
    )
}