import SearchBar from "./SearchBar"
import TopDisBar from "./TopDisBar"
import MainMovieDiv from "./MainMovieDiv"
import './discover.css'
import { useRef } from "react"
import SideBar from "../Home/SideBar"


export default function Discover(){

    const myRef = useRef(null);
    const myRef2 = useRef(null);

    const handleScroll = () => {
      // alert("rdxtfgyvhb");
      if (myRef.current) {
      
        myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        myRef2.current.focus();
      }
    };
  
  
    return(
        <>
        <div id="discoverContainer">
            <SideBar></SideBar>
            <div id="discovermain">
                <TopDisBar handleScroll={handleScroll}></TopDisBar>    
                <SearchBar ref={myRef} ref2={myRef2}></SearchBar>
                <MainMovieDiv></MainMovieDiv>
            </div>    
        </div>       
        </>
    )
}