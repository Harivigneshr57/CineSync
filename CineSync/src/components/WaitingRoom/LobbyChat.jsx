import { useState, useEffect, useRef } from "react";
import WaitingRoomMessages from "./WaitingRoomMessages";
import { socket } from "../Home/socket";

export default function LobbyChat() {

    const [currentmessage, setmessage] = useState("");
    const [allmessages, setmessages] = useState([]);

    const chatBoxRef = useRef(null);

    const room = localStorage.getItem("Roomname");
    const username = localStorage.getItem("Username");

    function sendMessageToRoom() {

        if (!currentmessage.trim()) return;

        const msgObj = {
            message: currentmessage,
            role: username
        };

        setmessages(prev => [...prev, msgObj]);

        socket.emit(
            "sendMessageInsideRoom",
            room,
            {
                message: currentmessage,
                role: username
            }   
        );

        setmessage("");
    }


    useEffect(() => {

        socket.on("messageFromRoom", (msgObj) => {

            setmessages(prev => [...prev, msgObj]);

        });

        return () => {
            socket.off("messageFromRoom");
        };

    }, []);


    useEffect(() => {

        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop =
                chatBoxRef.current.scrollHeight;
        }

    }, [allmessages]);


    return (
        <>
            <div className="lobbyChat">

                <div>
                    <p className="lobbbyPTag">
                        <i className="fa-solid fa-comments lobbyItag"></i>
                        LOBBY CHAT
                    </p>
                </div>

                <div>

                    <div id="lobbyChatBox" ref={chatBoxRef}>

                        {allmessages.map((msg, i) => (

                            <WaitingRoomMessages key={i} role={msg.role} message={msg.message}/>

                        ))}

                    </div>

                    <div className="chatInputContainer">

                        <input
                            type="text"
                            placeholder="Message the group..."
                            className="chatInput"
                            value={currentmessage}
                            onChange={(e) =>
                                setmessage(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessageToRoom();
                                }
                            }}
                        />

                        <button className="sendBtn" onClick={sendMessageToRoom}>
                            ➤
                        </button>

                    </div>

                </div>

            </div>
        </>
    );
}
