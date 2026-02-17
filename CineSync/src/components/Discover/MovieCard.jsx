import { useContext } from "react";
import { UserContext } from "../Login-SignIn/UserContext";
import { useNavigate } from "react-router-dom";

import Interstellar from "../../assets/images/96.jpg"; 
import Titanic from "../../assets/images/Titanic.png";
import TheAvengers from "../../assets/images/TheAvengers.png";
import Thor from "../../assets/images/Thor:DarkWorld.png";
import Conjuring1 from "../../assets/images/Conjurin1.png";
import Conjuring2 from "../../assets/images/Conjurin2.png";
import Guardians from "../../assets/images/GardiansOfTheGalaxy.png";
import Captain1 from "../../assets/images/Captain America : The First Avenger.png";
import Captain2 from "../../assets/images/Captain America : The Winter Soldier.png";
import SitaRamam from "../../assets/images/96.jpg"; 
import HeySinamika from "../../assets/images/Hey-Sinamika.jpg";
import HiNanna from "../../assets/images/Hi-Nanna.jpg";
import MiddleClass from "../../assets/images/96.jpg"; 
import Fail from "../../assets/images/12th Fail.png";
import Pariyerum from "../../assets/images/Pariyerum-Perumal.jpg";
import Premalu from "../../assets/images/Premalu.png";
import Kiss from "../../assets/images/Kiss.png";
import Parking from "../../assets/images/Parking.png";
import OhMyKadavule from "../../assets/images/OhMyKadavule.png";
import SabaNayagan from "../../assets/images/96.jpg"; 
import Sirai from "../../assets/images/Sirai.png";
import Eleven from "../../assets/images/Eleven.png";
import Maara from "../../assets/images/Maara.png";
import Asuran from "../../assets/images/Asuran.png";
import Meiyazhagan from "../../assets/images/Meialagan.png";
import ParandhuPo from "../../assets/images/ParanthuPoo.png";
import Madharasi from "../../assets/images/Madharasi.png";

export default function MovieCard({ url, title, genre, year }) {
  const { changeMovie } = useContext(UserContext);
  const navigate = useNavigate();

  const imageMap = {
    Interstellar: Interstellar,
    Titanic: Titanic,
    TheAvengers: TheAvengers,
    "Thor:TheDarkWorld": Thor,
    TheConjuring: Conjuring1,
    TheConjuring2: Conjuring2,
    GaurdiansOfTheGalaxy: Guardians,
    "CaptainAmerica:TheFirstAvenger": Captain1,
    "CaptainAmerica:TheWinterSoldier": Captain2,
    SitaRamam: SitaRamam,
    HeySinamika: HeySinamika,
    HiNanna: HiNanna,
    MiddleClass: MiddleClass,
    Fail: Fail,
    PariyerumPerumal: Pariyerum,
    Premalu: Premalu,
    Kiss: Kiss,
    Parking: Parking,
    OhMyKadavule: OhMyKadavule,
    SabaNayagan: SabaNayagan,
    Sirai: Sirai,
    Eleven: Eleven,
    Maara: Maara,
    Asuran: Asuran,
    Madharasi: Madharasi,
    Meiyazhagan: Meiyazhagan,
    ParandhuPo: ParandhuPo
  };

  function redirectVideo() {
    changeMovie(url, title);
    navigate("/single");
  }

  return (
    <div onClick={redirectVideo} className="movie-card">
      <div className="poster">
        <div
          className="posterimg"
          style={{
            backgroundImage: `url(${imageMap[title] || Fail})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      <div className="movie-meta">
        <h4>{title}</h4>
        <span>{genre} · {year}</span>
      </div>
    </div>
  );
}
