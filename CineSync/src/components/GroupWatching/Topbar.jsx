import { useContext, useState } from "react";
import Button from "../Login-SignIn/Button";
import { socket } from "../Home/socket";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Login-SignIn/UserContext";

export default function TopBar() {
  const { setAsRoom } = useContext(UserContext);
  const nav = useNavigate();
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const user = localStorage.getItem("Username");
  const host = localStorage.getItem("HostName");
  const isHost = user === host;

  function openExitPrompt() {
    setShowExitPrompt(true);
  }

  function closeExitPrompt() {
    setShowExitPrompt(false);
  }

  function confirmExitRoom() {
    socket.emit("exit", localStorage.getItem("Username"), localStorage.getItem("Roomname"));
    setAsRoom(false);
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
            <h4>{isHost ? "Do you want to close the room?" : "Do you want to exit the room?"}</h4>

            <div className="room-exit-actions">
              <Button id={"roomExitNo"} onClick={closeExitPrompt}>Cancel</Button>
              <Button id={"roomExitYes"} onClick={confirmExitRoom}>{localStorage.getItem('RoomRole')=='Host' ? "Close Room" : "Exit"}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
