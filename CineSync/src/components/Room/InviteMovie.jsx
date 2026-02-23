import Stage from "./Stage"
import InviteCode from "./CodeInvite"
import InviteFriends from "./InviteFriends"
import Button from "../Login-SignIn/Button"
import { useNavigate } from "react-router-dom";
import { socket } from "../Home/socket";

export default function InviteMovie({ code, onStep, step, movie, room }) {
    const navigate = useNavigate();
    function nav() {
        navigate("/discover");
    }

    function navigateToMainRoom() {
        console.log(localStorage.getItem("Roomname"));
        socket.emit("Startparty",localStorage.getItem("Roomname"));
        navigate("/mainRoom");
    }
    return (
        <>
            <div className="config">
                <div className="back">
                    <i class="fa-solid fa-arrow-left" onClick={() => nav()}></i>
                    <p>BACK TO DISCOVER</p>
                </div>
                <h1>Invite Participants</h1>
                <Stage step={step}></Stage>
                <div className="configurations">
                    <InviteCode code={code}></InviteCode>
                    <InviteFriends movie={movie} room={room} code={code}></InviteFriends>
                </div>
                <Button id={'start'} onClick={() => { navigateToMainRoom()}}>Start Watch Party <i class="fa-solid fa-caret-right"></i></Button>
            </div>
        </>
    )
}