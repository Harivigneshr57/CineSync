import { useEffect, useRef, useState } from "react";

export default function SelectMovies({ onMovie }) {
  const mov = useRef(null);

  const [movies, setMovies] = useState([]); 
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  function select(movie) {
    setSelectedMovieId(movie.id);
    onMovie(movie);
  }

  useEffect(() => {
    async function getMovies() {
      try {
        const response = await fetch(
          "https://cinesync-3k1z.onrender.com/getAllMovie"
        );

        const json = await response.json();
        const res = json.movies;

        const formatted = res.map(movie => ({
          id: movie.ROWID,
          title: movie.title,
          image: movie.movie_poster,
          genre: movie.Category_Name,
          description: movie.overview,
          director: movie.director,
          cast: movie.lead_cast,
          rating: movie.rating,
          year: movie.year,
        }));

        setMovies(formatted); 
      } catch (err) {
        console.error("Movie fetch failed:", err);
      }
    }

    getMovies();
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <div id="selectMovieContainer">
      {movies.map((movie,i )=> (
        <div key={i} onClick={() => select(movie)}>
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
