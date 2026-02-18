import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import EndGame from "../../assets/EndGame.png";
import Premalu from "../../assets/Premalu.png";
import OhMyKadavule from "../../assets/Oh My Kadavule.png";
import MiddleClass from "../../assets/MiddleClass.png";
import Thor from "../../assets/Thor1.png";
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
      title: "Avengers Endgame",
      genres: "Action • Adventure • Sci-Fi",
      description:
        "The universe lies in ruins after Thanos’ snap. With everything at stake, the Avengers assemble once more to reverse the devastation and fight their greatest battle yet.",
      image: EndGame,
      url:"https://movies-video-development.zohostratus.in/Videos/MLM_The_Avengers_2012_720p_BDRip_#Tamil_#Telugu_#Hindi_#Eng_x264.mkv"
    },
    {
      title: "Premalu",
      genres: "Drama • Romance",
      description:
        "A story about love, family, and the challenges that come with it. A drama that tugs at the heartstrings.",
      image: Premalu,
      url:"https://movies-video-development.zohostratus.in/Videos/Premalu_2024_Tamil_Full_Movie_720p_HDRip_(isaimini.com.es).mp4"
    },
    {
      title: "Oh My Kadavule",
      genres: "Romantic • Drama",
      description:
        "A romantic comedy about second chances and the unpredictability of love, with a touch of fantasy.",
      image: OhMyKadavule,
      url:"https://movies-video-development.zohostratus.in/Videos/Oh My Kadavule (2020) Tamil 720p HDRip 1.3GB.mkv"
    },
    {
      title: "Thor:TheDarkWorld",
      genres: "Action • Fantasy",
      description:
        "The God of Thunder, Thor, embarks on an epic adventure to save his home and family while battling against dark forces.",
      image: Thor,
      url:"https://movies-video-development.zohostratus.in/Videos/Thor_2_The_Dark_World_2011_Tamil_Telugu_Hindi_English_Blu_Ray_1080p.mkv"
    },
    {
      title: "MiddleClass",
      genres: "Drama • Comedy",
      description:
        "A story of a young person from a middle-class family who struggles with societal expectations and personal aspirations.",
      image: MiddleClass,
      url:"https://movies-video-development.zohostratus.in/Videos/Middle Class (2025) Tamil TRUE WEB-DL - 1080p - AVC - (D.mkv"
    },
  ];

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
        src={currentMovie.image}
        alt="bigMovie"
        style={{
          opacity: opacity,
          transition: "opacity 1s ease-in-out", 
        }}
      />
      <section className="bigMovieDetail">
        <div className="premieres">
          <div className="tonight">PREMIERES TONIGHT</div>
          <p>{currentMovie.genres}</p>
        </div>
        <div className="movieName">
          <h1>{currentMovie.title}</h1>
        </div>
        <div className="movieDesc">{currentMovie.description}</div>
        <div className="watchButtons">
          <Button icon={<i className="fa-solid fa-users"></i>} id="friendWatch">
            Watch with Friends
          </Button>
          <Button icon={<i className="fa-solid fa-play"></i>} id="soloPlay" onClick={()=>single(currentMovie.url,currentMovie.title)}>
            play
          </Button>
        </div>
      </section>
    </div>
  );
}
