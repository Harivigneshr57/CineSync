import { useContext, useState } from "react";
import { UserContext } from "../Login-SignIn/UserContext";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ url, title, genre, year, setOverview, setOverviewMovie }) {
  const { changeMovie } = useContext(UserContext);
  const navigate = useNavigate();

  function overview() {
      setOverview(true);
      setOverviewMovie({
        url:url,
        title:title,
        genre:genre,
        year:year,
      })
  }

  return (
    <div onClick={overview} className="movie-card">
        <div className="poster" onClick={overview}>
            <img src={url} alt="rendering ......" />
        </div>
    </div>
  );
}
