export default function MovieCard({image, movie }) {
  return (
    <div id="movie-card">
      <div className="poster" >
        <img src={image||movie.image} alt="Sorry" />
      </div>
      <div className="movie-meta">
        <h4>{movie.title}</h4>
        <span>{movie.genre} · {movie.year}</span>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${movie.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}