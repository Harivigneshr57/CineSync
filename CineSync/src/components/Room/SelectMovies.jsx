import { useRef , useState} from 'react';
import Avenger from '../../assets/Avenger.png';
import Interstellar from '../../assets/bigMovie.png';
import KGF from '../../assets/KGF.png';
import Leo from '../../assets/Leo.png';
import LoveToday from '../../assets/LoveToday.png';
import Master from '../../assets/Master.png';
import SpiderMan from '../../assets/SpiderMan.png';
import Thunivu from '../../assets/Thunivu.png';
export default function SelectMovies({ onMovie }) {
    const mov = useRef(null);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
  
    function select(movie) {
        setSelectedMovieId(movie.id); 
        onMovie(movie);
      }

    let data =  [
        {
          id: 1,
          title: "Interstellar",
          image: Interstellar, 
          genre: "Sci-Fi / Adventure",
          duration: "2h 49m",
          description:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          director: "Christopher Nolan",
          cast: "Matthew McConaughey, Anne Hathaway",
          rating: 8.7
        },
        {
          id: 2,
          title: "Avengers",
          image: Avenger,
          genre: "Action / Superhero",
          duration: "2h 23m",
          description:
            "Earth’s mightiest heroes must come together to stop a global threat.",
          director: "Joss Whedon",
          cast: "Robert Downey Jr., Chris Evans",
          rating: 8.0
        },
        {
          id: 3,
          title: "KGF2",
          image: KGF,
          genre: "Action / Drama",
          duration: "2h 36m",
          description:
            "A fierce rebel rises against powerful enemies to rule the Kolar Gold Fields.",
          director: "Prashanth Neel",
          cast: "Yash, Srinidhi Shetty",
          rating: 8.2
        },
        {
          id: 4,
          title: "Leo",
          image: Leo,
          genre: "Action / Thriller",
          duration: "2h 44m",
          description:
            "A mysterious man is forced to confront his violent past.",
          director: "Lokesh Kanagaraj",
          cast: "Vijay, Trisha",
          rating: 7.6
        },
        {
          id: 5,
          title: "Love Today",
          image: LoveToday,
          genre: "Romance / Comedy",
          duration: "2h 34m",
          description:
            "A modern love story that tests trust when phones are exchanged.",
          director: "Pradeep Ranganathan",
          cast: "Pradeep, Ivana",
          rating: 7.9
        },
        {
          id: 6,
          title: "Master",
          image: Master,
          genre: "Action / Drama",
          duration: "2h 59m",
          description:
            "An alcoholic professor is sent to reform juveniles in a prison.",
          director: "Lokesh Kanagaraj",
          cast: "Vijay, Vijay Sethupathi",
          rating: 7.5
        },
        {
          id: 7,
          title: "Spider-Man",
          image: SpiderMan,
          genre: "Action / Fantasy",
          duration: "2h 13m",
          description:
            "A teenager gains superpowers and learns the cost of responsibility.",
          director: "Jon Watts",
          cast: "Tom Holland, Zendaya",
          rating: 8.3
        },
        {
          id: 8,
          title: "Thunivu",
          image: Thunivu,
          genre: "Action / Heist",
          duration: "2h 26m",
          description:
            "A mastermind plans a bank heist to expose corruption.",
          director: "H. Vinoth",
          cast: "Ajith Kumar, Manju Warrier",
          rating: 6.8
        }
      ]
  
      return (
        <div id="selectMovieContainer">
          {data.map((movie) => (
            <div key={movie.id} onClick={() => select(movie)}>
              <div
                className="movie"
                style={{
                  backgroundImage: `url(${movie.image})`,
                  border:
                    selectedMovieId === movie.id
                      ? "2px dashed white"
                      : "none",
                }}
              ></div>
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      );
  }
  