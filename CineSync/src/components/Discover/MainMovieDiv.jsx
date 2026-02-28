import MovieCard from "./MovieCard";
import { useEffect, useState } from "react";
import Loading from "../Home/Loading";

export default function MainMovieDiv({
  overview,
  setOverview,
  overviewMovie,
  setOverviewMovie,
  searchRef,
  inputRef
}) {

  const [movies, setMovies] = useState([]);
  const [moviename, setmovieName] = useState("");
  const [showDiv, setShowDiv] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH MOVIES ================= */

  useEffect(() => {
    async function fetmovie() {
      try {
        setLoading(true);

        const res = await fetch(
          "https://cinesync-3k1z.onrender.com/getAllMovies"
        );

        const data = await res.json();
        setMovies(data.movies || []);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetmovie();
  }, []);

  /* ================= SEARCH ================= */

  function searchMovie(e) {
    const value = e.target.value;
    setmovieName(value);

    setShowDiv(!!value.trim());
  }

  /* ================= FILTER ================= */

  const filterMovieArray =
    moviename.trim().length > 0
      ? movies.filter((ele) =>
          ele.title.toLowerCase().includes(moviename.toLowerCase())
        )
      : movies;

  /* ================= CATEGORY GROUPING ================= */

  const categorized = {};

  filterMovieArray.forEach((movie) => {
    if (!categorized[movie.Category_Name]) {
      categorized[movie.Category_Name] = [];
    }
    categorized[movie.Category_Name].push(movie);
  });

  /* ================= LOADING ================= */

  if (loading) return <Loading />;

  /* ================= UI ================= */

  return (
    <>
      <div ref={searchRef} id="searchBarDiscover">
        <input
          ref={inputRef}
          onChange={searchMovie}
          style={{ width: "40rem" }}
          id="disSearch"
          placeholder="Enter movie Name..."
        />
      </div>

      {Object.keys(categorized).map((category, index) => (
        <div id="catMovie" key={index}>
          <h1 className="movieCat">{category}</h1>

          <div id="movieitems">
            {categorized[category].map((movie, i) => (
              <MovieCard
                key={i}
                video={movie.movie_url}
                url={movie.movie_poster}
                title={movie.title}
                genre={movie.Category_Name}
                year={movie.year}
                description={movie.overview}
                rating={movie.rating}
                director={movie.director}
                lead={movie.lead_cast}
                setOverview={setOverview}
                setOverviewMovie={setOverviewMovie}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}