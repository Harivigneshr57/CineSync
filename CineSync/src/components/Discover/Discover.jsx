import SearchBar from "./SearchBar"
import TopDisBar from "./TopDisBar"
import MainMovieDiv from "./MainMovieDiv"
import './discover.css'
import { useContext, useRef, useState } from "react"
import SideBar from "../Home/SideBar"
import Button from "../Login-SignIn/Button"
import OverView from "./Overview";
import { UserContext } from "../Login-SignIn/UserContext"


export default function Discover(){
    const myRef = useRef(null);
    const myRef2 = useRef(null);
    const {user}=useContext(UserContext);
    const [overview,setOverview] = useState(false);
    const [overviewMovie,setOverviewMovie] = useState({});

    async function addToFavorite(){
      await fetch("https://cinesync-3k1z.onrender.com/addFavorite",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username:user.username,movie_name:overviewMovie.title,movieYear:overviewMovie.year})
      }).then((res)=>res.json())
      .then((data)=>{
        console.log(data);
      })
    }


    const handleScroll = () => {
      
      if (myRef.current) {
        myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        myRef2.current.focus();
      }
    };

    function close(){
      setOverview(false);
    }
  
  
    return(
        <>
        <div id="discoverContainer">
            <SideBar></SideBar>
            <div id="discovermain">
                <TopDisBar handleScroll={handleScroll}></TopDisBar>    
                <MainMovieDiv overview={overview} setOverview={setOverview} overviewMovie={overviewMovie} setOverviewMovie={setOverviewMovie} ref={myRef} ref2={myRef2}></MainMovieDiv>
            </div> 
        </div>  
        <OverView overview={overview} overviewMovie={overviewMovie} setOverview={setOverview}></OverView>
        </>
    )
}