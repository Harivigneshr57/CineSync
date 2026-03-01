export default function MovieCard({ url, title, genre, year, setOverview, setOverviewMovie, video, lead, director, description, rating }) {
  function overview() {
      setOverview(true);
      setOverviewMovie({
        url:url,
        title:title,
        genre:genre,
        year:year,
        video:video,
        director:director,
        lead:lead,
        description:description,
        rating:rating
      })
  }

  return (
    <div onClick={overview} className="movie-card">
      <div className="poster">
        <img src={url} alt="rendering ......" />
  
        <div className="title-overlap">
          <h3>{title}</h3>
        </div>
  
      </div>
    </div>
  );
}
