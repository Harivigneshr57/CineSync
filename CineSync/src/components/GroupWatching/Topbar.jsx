import { useContext } from "react"
import Button from "../Login-SignIn/Button"
import { socket } from "../Home/socket";
import { UserContext } from "../Login-SignIn/UserContext"
import { useNavigate } from "react-router-dom";
export default function TopBar(){
    let nav = useNavigate();
    const {roomName,movieName} = useContext(UserContext);
    function exit(){
        socket.emit('exit',localStorage.getItem('Username'),localStorage.getItem('Roomname'));
        nav('/room');
    }
    return(
        <>
            <div className="topBar">
                <h5>{localStorage.getItem('MovieName')}</h5>
                <div className="topButtons">
                    <Button id={'roomExit'} onClick={exit}><i class="fa-solid fa-arrow-right-from-bracket"></i> Exit</Button>
                </div>
            </div>
        </>
    )
}