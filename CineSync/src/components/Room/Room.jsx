import { useState,useEffect } from "react"
import { useLocation } from "react-router-dom";
import SideBar from "../Home/SideBar"
import ConfigMovie from "./ConfigMovie";
import InviteMovie from "./InviteMovie";
import SelectMovie from "./SelectMovie";
import SelectedMovie from "./SelectedMovie";
import './room.css';
import HostView from "../WaitingRoom/Hostview";
export default function Room() {
    const [step, setStep] = useState(1);
    const [code, setCode] = useState("");
    const [movie, setMovie] = useState({});
    const [room, setRoom] = useState('');
    const [confirmDiv, setconfirmDiv] = useState(false);

    function onSetMovie(movie) {
        setMovie(movie);
    }
    function onSetStep(step) {
        setStep(step);
    }
    const location=useLocation();
    if(location.state){
        useEffect(()=>{
            const {moviedet}=location.state;
            console.log("hi na na");
            // console.log(moviedet);
            console.log("------------------");
            setMovie(moviedet);
            setStep(2);       
        },[])
    }
    return (
        <>
            <div id="room">
                <SideBar></SideBar>
                {step == 1 ? <SelectMovie onStep={onSetStep} onMovie={onSetMovie} step={step} movie={movie}></SelectMovie> : step == 2 ? <ConfigMovie image={movie.image} setRoom={setRoom} room={room} setCode={setCode} onStep={setStep} step={step} confirmDiv={confirmDiv} setconfirmDiv={setconfirmDiv} movie={movie}></ConfigMovie> : <InviteMovie room={room} movie={movie} code={code} onStep={setStep} step={step}></InviteMovie>}
                {step == 3 ? <HostView></HostView> : <SelectedMovie confirmDiv={confirmDiv} setconfirmDiv={setconfirmDiv} movie={movie}></SelectedMovie>}

            </div>
        </>
    )
}