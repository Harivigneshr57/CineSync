import Button from "../Login-SignIn/Button"
import { useNavigate } from "react-router-dom"
export default function CreateRoom(){
    let navigate = useNavigate();
    function createRoom(){
        navigate("/createRoom")
    }
    return(
        <>
        <div className="createRoom flex">
            <div className="movieTime flex">
                <i className="fa-solid fa-video"></i>
            </div>
            <h1>Start a Watch Party</h1>
            <p>Be the host, invite friends, and control the cinematic experience together.</p>
            <Button id={"createRoom"} onClick={createRoom} icon={<i className="fa-solid fa-circle-plus"></i>}>Create Room</Button>
        </div>
        </>
    )
}