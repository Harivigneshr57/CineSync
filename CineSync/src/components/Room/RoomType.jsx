import SideBar from "../Home/SideBar"
import './room.css'
import CreateRoom from "./CreateRoom"
import JoinRoom from "./JoinRoom"
export default function RoomType(){
    return(
        <>
            <div className="roomType flex">
                <SideBar></SideBar>
                <CreateRoom></CreateRoom>
                <JoinRoom></JoinRoom>
            </div>
        </>
    )
}