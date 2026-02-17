import Stage from "./Stage"
import InviteCode from "./CodeInvite"
import InviteFriends from "./InviteFriends"
import Button from "../Login-SignIn/Button"
import { useNavigate } from "react-router-dom"
export default function InviteMovie({code,onStep,step}  ){
    const navigate = useNavigate();
    function nav(){
        navigate("/discover");   
    }
    return(
        <>
            <div className="config">
                <div className="back">
                    <i class="fa-solid fa-arrow-left" onClick={()=>nav()}></i>
                    <p>BACK TO DISCOVER</p>
                </div>
                <h1>Invite Participants</h1>
                <Stage step={step}></Stage>
                <div className="configurations">
                    <InviteCode code={code}></InviteCode>
                    <InviteFriends></InviteFriends>
                </div>
                <Button id={'start'}>Start Watch Party <i class="fa-solid fa-caret-right"></i></Button>
            </div>
        </>
    )
}