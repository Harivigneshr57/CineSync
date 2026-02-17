import { use, useState } from "react"
import InteractiveFeatures from "./InteractiveFeatures";
import { useContext, useEffect } from 'react';
import { UserContext } from "../Login-SignIn/UserContext";
import Stage from "./Stage";
import MiniGame from "./MiniGame";
import Button from '../Login-SignIn/Button'
import toast from "react-hot-toast";
import { data } from "react-router-dom";
export default function ConfigMovie({step,onStep,setCode}){
    const [audio,setAudio] = useState(false);
    const [video,setVideo] = useState(false);
    const [reaction,setReaction] = useState(false);
    const [chat,setChat] = useState(false);
    const [game,setGame] = useState(false);
    const [room,setRoom] = useState('');
    const [confirmDiv,setconfirmDiv]=useState(false);
    const { user } = useContext(UserContext);
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
      
    function check(){
        if(room.length < 5 ){
            toast.error("Room Name Should Contain AtLeast 5 Char !!",toastErrorStyle)
        }
        else{
            setconfirmDiv(true);
        }
    }
     function addRoom(){
         fetch("https://cinesync-3k1z.onrender.com/addRoom",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username:user.username,room:room,audio:audio,video:video,reaction:reaction,chat:chat,game:game})
        }).then((res)=>res.json())
        .then((data)=>{
            console.log("=====================================");
            console.log(data);
          if(data.message.includes("Already")){
            setconfirmDiv(false);
            toast.error("Room Name Should Contain AtLeast 5 Char !!",toastErrorStyle)

          }
          else{
            setCode(data.code);
            setconfirmDiv(false);
            onStep(3);
          }
        })
        .catch((err)=>{
            setconfirmDiv(false);
            console.log(err)});
    }
    return(
        <>
        <div style={{filter:confirmDiv?"blur(10px)":"none"}} className="config">
            <div className="back">
                <i class="fa-solid fa-arrow-left" onClick={()=>onStep(1)}></i>
                <p>BACK TO MOVIE SELECTION</p>
            </div>
            <h1>Advanced Configuration</h1>
            <Stage step={step}></Stage>
            <div className="configurations">
                <h6>Room Name</h6>
                <input type="text" name="roomName" id="roomName" value={room} onChange={(e)=>setRoom(e.target.value)    } placeholder="Enter Your Room Name" />
                <InteractiveFeatures video={video} audio={audio} chat={chat} reaction={reaction} setAudio={setAudio} setVideo={setVideo} setChat={setChat} setReaction={setReaction}></InteractiveFeatures>
                <MiniGame game={game} setGame={setGame}></MiniGame>
            </div>
            <Button id='inviteFriends' onClick={check}>Continue to Invite Friends    <i class="fa-solid fa-arrow-right"></i></Button>
        </div>
        <div style={{display:confirmDiv?"block":"none"}} id="confirmation">
            <p>Do you want to confirm movie ?</p>
            <div style={{display:"flex"}} className="confirm">
                <button onClick={()=>setconfirmDiv(false)}>No,I want to edit movie</button>
                <button onClick={()=>addRoom()}>Yes, Confirm</button>
            </div>
        </div>
        </>
    )
}