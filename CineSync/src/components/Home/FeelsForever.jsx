import { useNavigate } from "react-router-dom";
import { UserContext } from "../Login-SignIn/UserContext";
import { useContext, useEffect, useState } from "react";
import OverView from "../Discover/Overview";
import MovieCard from "../Discover/MovieCard";

export default function FeelsForever() {

    const nav = useNavigate();
    const { changeMovie, user } = useContext(UserContext);

    const [movies, setMovies] = useState([]);
    const [overview, setOverview] = useState(false);
    const [overviewMovie, setOverviewMovie] = useState({});

    function single(title) {
        changeMovie("", title);
        nav('/single');
    }
    FeelsForever
    function openOverview(movie) {
        setOverviewMovie(movie);
        setOverview(true);
    }

    useEffect(() => {
        const fetchFeelsForever = async () => {
            try {
                const res = await fetch("https://cinesync-3k1z.onrender.com/getFeelsForever");
                const data = await res.json();
                console.log(data);
    
                setMovies(data.result || []);
            } catch (err) {
                console.log("Error fetching Feels & Forever:", err);
            }
        };
        fetchFeelsForever();
    }, []);

    return (
        <>
            <div className="trendingMovies">
                <h2>Feels & Forever</h2>

                <div className="trends">
                    {movies.map((movie, i) => (
                        <MovieCard
                            key={i}
                            url={movie.movie_poster}
                            title={movie.title}
                            genre=""
                            year={movie.year}
                            video=""
                            lead={movie.lead_cast}
                            director={movie.director}
                            description={movie.overview}
                            rating={movie.rating}
                            setOverview={setOverview}
                            setOverviewMovie={setOverviewMovie}
                            onClick={() => openOverview(movie)}
                        />
                    ))}
                </div>
            </div>

            <OverView
                overview={overview}
                overviewMovie={overviewMovie}
                setOverview={setOverview}
            />
        </>
    );
}