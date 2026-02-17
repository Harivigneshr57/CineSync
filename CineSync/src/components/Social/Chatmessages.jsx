import { useState, useEffect } from "react";
import Ourmessage from "./Ourmessage";
import { io } from "socket.io-client";

const socket = io("http://localhost:3458");

function Chatmeassages({ messageArray, setArray, currentUsers }) {

    const [messageinput, setMessage] = useState("");
    const username = localStorage.getItem("Username");

    useEffect(() => {

        socket.emit("addtoserver", username);

        socket.on("privatemessage", (message, senderUsername) => {

            if (senderUsername === currentUsers) {

                setArray(prev => [
                    ...prev,
                    {
                        role: "friend",
                        message: message
                    }
                ]);

            }

        });

        return () => {
            socket.off("privatemessage");
        };

    }, [currentUsers]);


    const sendMessage = (friend) => {

        if (!messageinput.trim()) return;

        setArray(prev => [
            ...prev,
            {
                role: "our",
                message: messageinput
            }
        ]);

        socket.emit("one2one", messageinput, friend, username);

        tosave(friend, messageinput, username);

        setMessage("");
    };


    async function tosave(friend, message, username) {

        try {

            const response = await fetch("http://localhost:3458/savemessage", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message,
                    username,
                    friend
                })

            });

            const data = await response.json();

            console.log(data);

        }
        catch (err) {

            console.log(err);

        }

    }


    return (

        <div className="chat-message-section">

            <div className="chat-meassages">

                <div className="chat-messages-child"
                    style={{
                        display: "flex",
                        gap: "2rem",
                        flexDirection: "column"
                    }}
                >

                    {messageArray.map((msg, index) => (

                        <Ourmessage
                            key={index}
                            message={msg.message}
                            role={msg.role}
                        />

                    ))}

                </div>

            </div>


            <div className="chat-messaging">

                <input
                    type="text"
                    placeholder="Type message..."
                    value={messageinput}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <button id="chat-send" onClick={() => { sendMessage(currentUsers) }}><i className="fa-solid fa-paper-plane" id="send-message"></i></button>

            </div>

        </div>

    );

}

export default Chatmeassages;