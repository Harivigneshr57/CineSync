import { useEffect, useState } from "react";
import Button from "../Login-SignIn/Button";
import { socket } from "../Home/socket";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const nav = useNavigate();
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  cons [exitVal,setExitVal]=useState(true);

  function openExitPrompt() {
    setShowExitPrompt(true);
  }

  function closeExitPrompt() {
    setShowExitPrompt(false);
  }

  function confirmExitRoom() {
    socket.emit("exit", localStorage.getItem("Username"), localStorage.getItem("Roomname"));
    setShowExitPrompt(false);
    nav("/room");
  }

  useEffect(()=>{
   let user=localStorage.getItem("Username");
   let host=localStorage.getItem("HostName");
   if(user===host){
    setExitVal(true)
   } 
   else{
    setExitVal(false);
   }
  },[]);

  return (
    <>
      <div className="topBar">
        <h5>{localStorage.getItem("MovieName")}</h5>
        <div className="topButtons">
          <Button id={"roomExit"} onClick={openExitPrompt}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> {exitVal ?"Exit":"Leave"}
          </Button>
        </div>
      </div>

      {showExitPrompt && (
        <div className="room-exit-overlay" role="dialog" aria-modal="true" aria-label="Exit room confirmation">
          <div className="room-exit-modal">
            <h4>{exitVal ?"Exit":"Leave"} watch party?</h4>
        
            <div className="room-exit-actions">
              <Button id={"roomExitNo"} onClick={closeExitPrompt}>Cancel</Button>
              <Button id={"roomExitYes"} onClick={confirmExitRoom}>{exitVal ?"Exit":"Leave"} </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}