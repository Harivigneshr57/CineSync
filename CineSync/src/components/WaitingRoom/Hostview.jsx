import LobbyChat from "../WaitingRoom/LobbyChat";
import Lobbymembers from "../WaitingRoom/Lobbymembers";
export default function HostView() {
    return (
        <>
            <LobbyChat></LobbyChat>
            <Lobbymembers ></Lobbymembers>
        </>
    )
}