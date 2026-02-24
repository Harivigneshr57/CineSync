import { useContext } from "react"
import Button from "../Login-SignIn/Button"
import { UserContext } from "../Login-SignIn/UserContext"
export default function TopBar(){
    const {roomName,movieName} = useContext(UserContext);
    return(
        <>
            <div className="topBar">
                <h5>{roomName}</h5>
                <div className="topButtons">
                    <Button id={'roomExit'}><i class="fa-solid fa-arrow-right-from-bracket"></i> Exit</Button>
                </div>
            </div>
        </>
    )
}