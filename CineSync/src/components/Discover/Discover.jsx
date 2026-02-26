import SearchBar from "./SearchBar"
import TopDisBar from "./TopDisBar"
import MainMovieDiv from "./MainMovieDiv"
import './discover.css'
import { useContext, useRef, useState } from "react"
import SideBar from "../Home/SideBar"
import Button from "../Login-SignIn/Button"
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
      // alert("rdxtfgyvhb");
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
        <div className="overviewContainer flex" style={overview?{display:"flex"}:{display:"none"}}>
                <div className="flex">
                    <img src={overviewMovie.url} alt="" />
                    <div className="overviev">
                        <h1>{overviewMovie.title}</h1>
                        <div className="aboutMovie">
                            <div className="ratings">
                              <i class="fa-solid fa-star"></i>
                              {overviewMovie.rating}
                            </div>
                            <div className="horizonLine"></div>
                            <h3>{overviewMovie.year}</h3>
                            <div className="horizonLine"></div>
                            <h3>{overviewMovie.genre}</h3>
                        </div>
                        <div className="contents">
                          <h6>overview</h6>
                          <h5>{overviewMovie.description}</h5>
                        </div>
                        <div className="peoples">
                          <div className="director">
                            <h6>DIRECTOR</h6>
                            <h3>{overviewMovie.director}</h3>
                          </div>
                          <div className="lead">
                            <h6>LEADCAST</h6>
                            <h3>{overviewMovie.lead}</h3>
                          </div>
                        </div>
                        <div className="playButtons">
                            <Button id="playSolo"><i class="fa-solid fa-play"></i> Play Now</Button>
                            <Button id='host'><i class="fa-solid fa-people-group"></i> Host Party</Button>
                            <Button onClick={addToFavorite} id='like'><i class="fa-regular fa-heart"></i></Button>
                        </div>
                    </div>
                    <Button id='close'onClick={close}><i class="fa-solid fa-xmark"></i></Button>
                </div>
            </div>        
        </>
    )
}