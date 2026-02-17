import { useState } from "react"
import SideBar from "../Home/SideBar"
import ConfigMovie from "./ConfigMovie";
import InviteMovie from "./InviteMovie";
import SelectMovie from "./SelectMovie";
import SelectedMovie from "./SelectedMovie";
import './room.css';
export default function Room(){
    const [step,setStep] = useState(1);
    const [code,setCode]=useState("");
    const [movie,setMovie] = useState({});
    function onSetMovie(movie){
        setMovie(movie);
    }
    function onSetStep(step){
        setStep(step);
    }
    return (
        <>
            <div id="room" className="flex">
                <SideBar></SideBar>
                {step==1?<SelectMovie onStep={onSetStep} onMovie={onSetMovie} step={step} movie={movie}></SelectMovie>:step==2?<ConfigMovie setCode={setCode} onStep={setStep} step={step}></ConfigMovie>:<InviteMovie code={code} onStep={setStep} step={step}></InviteMovie>}
                <SelectedMovie movie={movie}></SelectedMovie>
            </div>
        </>
    )
}