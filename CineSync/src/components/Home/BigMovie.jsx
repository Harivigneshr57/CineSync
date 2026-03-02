import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import EndGame from "../../assets/homepage/EndGame.png";
import Premalu from "../../assets/homepage/Premalu.png";
import OhMyKadavule from "../../assets/homepage/Oh My Kadavule.png";
import MiddleClass from "../../assets/homepage/MiddleClass.png";
import Thor from "../../assets/homepage/Thor1.png";
import Button from "../Login-SignIn/Button";
import { UserContext } from "../Login-SignIn/UserContext";

export default function BigMovie() {
  const { changeMovie } = useContext(UserContext);
  const nav = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  function single(url,title) {
    changeMovie(url,title);
    nav("/single");
  }

  const movies = [
    {
      id:4,
      title: "Avengers Endgame",
      genre: "Action • Adventure • Sci-Fi",
      description:
        "The universe lies in ruins after Thanos’ snap. With everything at stake, the Avengers assemble once more to reverse the devastation and fight their greatest battle yet.",
      url: EndGame,
      director:"Joss Whedon",
      cast:"Robert Downey Jr., Chris Evans, Scarlett Johansson",
      rating:8,
      year:2012,
      video:"https://movies-video-development.zohostratus.in/Videos/MLM_The_Avengers_2012_720p_BDRip_%23Tamil_%23Telugu_%23Hindi_%23Eng_x264.mkv?versionId=01khb9ca0505k3v423qnaakhts"
    },
    {
      id:18,
      title: "Premalu",
      genre: "Drama • Romance",
      description:
        "A story about love, family, and the challenges that come with it. A drama that tugs at the heartstrings.",
      url: Premalu,
      director:"Girish A. D.",
      cast:" Naslen, Mamitha Baiju",
      rating:8.3,
      year:2024,
      video:"https://movies-video-development.zohostratus.in/Videos/Premalu_2024_Tamil_Full_Movie_720p_HDRip_%28isaimini.com.es%29.mp4?versionId=01khb8fypg8shvywrh5qc6kkjd"
    },
    {
      id:21,
      title: "Oh My Kadavule",
      genre: "Romantic • Drama",
      description:
        "A romantic comedy about second chances and the unpredictability of love, with a touch of fantasy.",
      url: OhMyKadavule,
      director:"Ashwath Marimuthu",
      cast:" Ashok Selvan, Ritika Singh, Vani Bhojan ",
      rating:8.1,
      year:2020,
      video:"https://movies-video-development.zohostratus.in/Videos/Oh%20My%20Kadavule%20%282020%29%20Tamil%20720p%20HDRip%201.3GB.mkv?versionId=01khba9dz3tqsj9q360km72e7x"
    },
    {
      id:5,
      title: "Thor:TheDarkWorld",
      genre: "Action • Fantasy",
      description:
        "The God of Thunder, Thor, embarks on an epic adventure to save his home and family while battling against dark forces.",
      url: Thor,
      director:"Alan Taylor",
      cast:"Chris Hemsworth, Natalie Portman, Tom Hiddleston",
      rating:6.8,
      year:2013,
      video:"https://movies-video-development.zohostratus.in/Videos/Thor_2_The_Dark_World_2011_Tamil_Telugu_Hindi_English_Blu_Ray_1080p.mkv?versionId=01khb9wk29wr6mxhcnrh8aesa3"
    },
    {
      id:15,
      title: "MiddleClass",
      genre: "Drama • Comedy",
      description:
        "A story of a young person from a middle-class family who struggles with societal expectations and personal aspirations.",
      url: MiddleClass,
      director:"Kishore Muthuramalingam",
      cast:"Munishkanth,Vijayalakshmi Agathiyan,Kaali VenkatRadha Ravi,Malavika Avinash.",
      rating:6.8,
      year:2025,
      video:"https://movies-video-development.zohostratus.in/Videos/Middle%20Class%20%282025%29%20Tamil%20TRUE%20WEB-DL%20-%201080p%20-%20AVC%20-%20%28D.mkv?versionId=01khbb1ejjbk22y3fxgrq2gegy"
    },
  ];
  function navigateToCreateRoom(currentMovie) {
    console.log("navigate poguthu");
    nav('/createRoom', { state: { moviedet: currentMovie } })
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0); 
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length); 
        setOpacity(1); 
      }, 500); 
    }, 5000); 

    return () => clearInterval(interval); 
  }, [currentIndex]);

  const currentMovie = movies[currentIndex];

  return (
    <div className="bigMovieContainer">
      <img
        src={currentMovie.url}
        alt="bigMovie"
        style={{
          opacity: opacity,
          transition: "opacity 1s ease-in-out", 
        }}
      />
      <div className="movieInfoAction">
        <section className="bigMovieDetail">
          <div className="premieres">
            <div className="tonight">PREMIERES TONIGHT</div>
            <p>{currentMovie.genre}</p>
          </div>
          <div className="movieName">
            <h1>{currentMovie.title}</h1>
          </div>
          <div className="movieDesc">{currentMovie.description}</div>
          <div className="watchButtons">
            <Button  onClick={()=>navigateToCreateRoom(currentMovie)} icon={<i className="fa-solid fa-users"></i>}  id="friendWatch">
              Watch with Friends
            </Button>
            <Button icon={<i className="fa-solid fa-play"></i>} id="soloPlay" onClick={()=>single(currentMovie.url,currentMovie.title)}>
              Play
            </Button>
          </div>
        </section>
        <div className="fbButtons">
          <Button onClick={() =>setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)}> <i className="fa-solid fa-angle-left"></i></Button>
          <Button onClick={() =>setCurrentIndex((prev) => (prev + 1) % movies.length)}><i className="fa-solid fa-angle-right"></i></Button>
        </div>
      </div>
    </div>
  );
}
