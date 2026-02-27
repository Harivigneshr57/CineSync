import { useNavigate } from "react-router-dom";
import Button from "../Login-SignIn/Button"
import { UserContext } from "../Login-SignIn/UserContext";
import toast from "react-hot-toast";
import { useContext } from "react";
export default function OverView({overview,overviewMovie,setOverview}){
    const {setMovie} = useContext(UserContext);
    let nav = useNavigate();
    async function addToFavorite(){
        await fetch("https://cinesync-3k1z.onrender.com/addFavorite",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({username:user.username,movie_name:overviewMovie.title,movieYear:overviewMovie.year})
        }).then((res)=>res.json())
        .then((data)=>{
            toast.success('Added to Favourite !!')
          console.log(data);
        })
      }

      const navigate=useNavigate();
function navigateToCreateRoom(){
  console.log("navigate poguthu");
  navigate('/createRoom',{state:{moviedet:overviewMovie}})
}

      function solo(a){
        setMovie(a)
        nav('/single');
      }


      function close(){
        setOverview(false);
      }
    return(
        <>
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
                            <Button id="playSolo" onClick={()=>solo(overviewMovie)}><i class="fa-solid fa-play"></i> Play Now</Button>
                            <Button id='host' onClick={navigateToCreateRoom}><i class="fa-solid fa-people-group"></i> Host Party</Button>
                            <Button onClick={addToFavorite} id='like'><i class="fa-regular fa-heart"></i></Button>
                        </div>
                    </div>
                    <Button id='close'onClick={close}><i class="fa-solid fa-xmark"></i></Button>
                </div>
            </div>
        </>
    )
}