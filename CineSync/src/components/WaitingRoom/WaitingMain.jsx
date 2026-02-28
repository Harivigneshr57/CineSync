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
import Siraj from "../../assets/images/Sirai.png";
import Maara from "../../assets/images/Maara.png";
import Asuran from "../../assets/images/Asuran.png";
import Meiyazhagan from "../../assets/images/Meialagan.png";
import ParandhuPo from "../../assets/images/ParanthuPoo.png";
import Madharasi from "../../assets/images/Madharasi.png";
import Eleven from "../../assets/images/Eleven.png";


export default function WaitingMain(){
    const{movieImg}=useContext(UserContext);
    return (
        <>
        <div className="waitingMain">
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"1rem"}}>
            <h3 style={{color:"rgb(83, 120, 149)",letterSpacing:"4px"}}>HOST IS PREPARING THE THEATRE</h3>
            
            <hr ></hr>
            </div>
            <img style={{width:"25rem"}} src={localStorage.getItem('MovieImage')} alt="Image"/>
            <button id="iamReady"><i class="fa-regular fa-circle-play"></i> I'M READY</button>
        </div>
        </>
    )
}