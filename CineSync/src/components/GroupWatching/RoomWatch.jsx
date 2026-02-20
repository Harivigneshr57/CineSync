import { useRef } from "react";
import SideBar from "../Home/SideBar";
import TopBar from "./Topbar";
import VideoArea from "./VideoArea";
import './group.css';
export default function RoomWatch(){
    let video = useRef(null);
    let container = useRef(null);
    return(
    <>
        <div className="roomWatch">
            <SideBar></SideBar>
            <TopBar></TopBar>
            <VideoArea reference={video} references={container}></VideoArea>
        </div>
    </>
    )
}