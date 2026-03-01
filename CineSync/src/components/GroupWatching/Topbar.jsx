import { useState } from "react";
import Button from "../Login-SignIn/Button";
import { socket } from "../Home/socket";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const nav = useNavigate();
  const [showExitPrompt, setShowExitPrompt] = useState(false);

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

  return (
    <>
      <div className="topBar">
        <h5>{localStorage.getItem("MovieName")}</h5>
        <div className="topButtons">
          <Button id={"roomExit"} onClick={openExitPrompt}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Exit
          </Button>
        </div>
      </div>

      {showExitPrompt && (
        <div className="room-exit-overlay" role="dialog" aria-modal="true" aria-label="Exit room confirmation">
          <div className="room-exit-modal">
            <h4>Exit room?</h4>
            <p>Do you want to leave this watch party?</p>
            <div className="room-exit-actions">
              <Button id={"roomExitNo"} onClick={closeExitPrompt}>No</Button>
              <Button id={"roomExitYes"} onClick={confirmExitRoom}>Yes</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}