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
        <div className="poster" onClick={overview}>
            <img src={url} alt="rendering ......" onClick={overview}/>
        </div>
    </div>
  );
}
