import { useContext } from "react";
import { UserContext } from "../Login-SignIn/UserContext";


export default function WaitingMain(){
    const{movieImg}=useContext(UserContext);
    return (
        <>
        <div className="waitingMain">
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"1rem"}}>
            <h3 style={{color:"rgb(83, 120, 149)",letterSpacing:"4px"}}>HOST IS PREPARING THE THEATRE</h3>
            
            <hr ></hr>
            </div>
            <img style={{width:"25rem"}} src={movieImg} alt="Image"/>
            <button id="iamReady"><i class="fa-regular fa-circle-play"></i> I'M READY</button>
        </div>
        </>
    )
}