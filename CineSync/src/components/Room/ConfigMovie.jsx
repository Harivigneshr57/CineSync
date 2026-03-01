import { use, useState } from "react"
import InteractiveFeatures from "./InteractiveFeatures";
import { useContext, useEffect } from 'react';
import { UserContext } from "../Login-SignIn/UserContext";
import Stage from "./Stage";
import MiniGame from "./MiniGame";
import Button from '../Login-SignIn/Button'
import toast from "react-hot-toast";
import { data } from "react-router-dom";
import { socket } from "../Home/socket";

export default function ConfigMovie({ setRoom, room, roomPassword, setRoomPassword, step, onStep, setCode, confirmDiv,setconfirmDiv,image,movie}) {
    const [hostControl, setHostControl] = useState(true);
    const {setAsRoom,changeMovieImage,user} = useContext(UserContext);
    const toastErrorStyle = {
        style: {
            borderRadius: "1rem",
            background: "var(--error)",
            color: "white",
            fontWeight: 600,
            minWidth: "26rem",
        },
        iconTheme: {
            fontWeight: 600,
            secondary: "var(--white)",
        },
    };

    function check() {
        if (room.length < 5) {
            toast.error("Room Name Should Contain AtLeast 5 Char !!", toastErrorStyle)
        }
        else if (roomPassword.length < 4) {
            toast.error("Room password should contain at least 4 characters", toastErrorStyle);
        }
        else {
            setconfirmDiv(true);
        }
    }
    async function addRoom() {
        setAsRoom(true);
        {console.log(image);}
        changeMovieImage(image);
        let res = await fetch("https://cinesync-3k1z.onrender.com/addRoom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username:user.username, room: room, password: roomPassword, hostControl: hostControl, movieId : movie.id })
        })

        let data = await res.json();

                console.log("=====================================");
                console.log(data);
                if (data.message.includes("Already")) {
                    setconfirmDiv(false);
                    toast.error("Already room exist !!", toastErrorStyle);
                }
                else {
                    console.log();
                    setCode(data.code);
                    setconfirmDiv(false);
                    onStep(3);
                    socket.emit("joinRoom", room, user.username);
                    console.log(room);
                    localStorage.setItem("Roomname",room);
                    localStorage.setItem("RoomRole", "Host");
                    localStorage.setItem("HostControlEnabled", String(hostControl));
                    addToRoom(room);
                    console.log("trying to join host");
                }
    }

    function addToRoom(roomName) {
        
        fetch("https://cinesync-3k1z.onrender.com/addToRoom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                roomname:localStorage.getItem("Roomname")
                ,username:user.username
                ,Role:"Host"
                ,status:1})
        }).then((res) => res.json())
            .then((data) => {
                if(data.message== "Joined successfully"){
                    console.log("Joined successfully");
                }
                else{
                    console.log("Error in joining");
                }
            })
            .catch((err) => {

        });
    }
    return (
        <>
            <div style={{ filter: confirmDiv ? "blur(10px)" : "none" }} className="config">
                <div className="back">
                    <i class="fa-solid fa-arrow-left" onClick={() => onStep(1)}></i>
                    <p>BACK TO MOVIE SELECTION</p>
                </div>
                <h1>Advanced Configuration</h1>
                <Stage step={step}></Stage>
                <div className="configurations">
                    <h6>Room Name</h6>
                    <input type="text" name="roomName" id="roomName" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Enter Your Room Name" />
                    <h6>Room Password</h6>
                    <input type="password" name="roomPassword" id="roomPassword" value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)} placeholder="Enter Room Password" />
                    <InteractiveFeatures hostControl={hostControl} setHostControl={setHostControl}></InteractiveFeatures>
                </div>
                <Button id='inviteFriends' onClick={check}>Continue to Invite Friends    <i class="fa-solid fa-arrow-right"></i></Button>
            </div>
            <div style={{ display: confirmDiv ? "flex" : "none" }} id="confirmation">
                <p>Do you want to confirm movie ?</p>
                <div style={{ display: "flex" }} className="confirm">
                    <button id="no" onClick={() => setconfirmDiv(false)}>No,I want to edit movie</button>
                    <button id="yes" onClick={() => addRoom()}>Yes, Confirm</button>
                </div>
            </div>
        </>
    )
}