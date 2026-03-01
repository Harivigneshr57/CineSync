import { useRef, useState } from 'react'
import Button from '../Login-SignIn/Button';
import { socket } from '../Home/socket';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../Login-SignIn/UserContext";

export default function JoinRoom() {
    const roomIdInput = useRef(null);
    const passwordInput = useRef(null);
    let button = useRef(null);
    const [roomId, setRoomId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setAsRoom } = useContext(UserContext);

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
    const toastSuccessStyle = {
        style: {
            borderRadius: "1rem",
            background: "#16A34A",
            color: "white",
            fontWeight: 600
        },
        iconTheme: {
            primary: "white",
            secondary: "#16A34A"
        }
    };


    async function joinRoom() {
        if (!roomId.trim() || !password.trim()) {
            toast.error("Room ID and password are required", toastErrorStyle);
            return;
        }

        try {
            const response = await fetch("https://cinesync-3k1z.onrender.com/getRoomName", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomCode: roomId.trim(), password: password.trim() })
            });
            const data = await response.json();
            if (data.roomname) {
            localStorage.setItem("Roomname", data.roomname);
                    localStorage.setItem('MovieImage',data.movie_poster);
                    localStorage.setItem('movieVideo',data.movie_url);
                    localStorage.setItem('MovieName',data.title)
                console.log("Room Name " + data.roomname.length);

                toast.success("You joined the room", toastSuccessStyle);

                let res = await fetch("https://cinesync-3k1z.onrender.com/roomcheck", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        roomCode: roomId.trim()
                    })
                })
                let results = await res.json();
                    
                if (results.result.length === 1) {
                    let hostdetail = await fetch("https://cinesync-3k1z.onrender.com/getHostName", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                roomname: localStorage.getItem("Roomname")
                            })
                        })

                        let hostname = await hostdetail.json();
                        console.log(hostname.hostname[0].username);
                        socket.emit("joinRoom", localStorage.getItem("Roomname"), localStorage.getItem("Username"));
                        socket.emit("middlejoin",localStorage.getItem("Username"),localStorage.getItem("Roomname"),hostname.hostname[0].username);
                        navigate("/mainRoom");
                    } else {
                        navigate("/waitingRoom");
                    }
                    setAsRoom(true);
                }
                else {
                    toast.error("Invalid room ID or password", toastErrorStyle);
                }
            } catch (err) {
                console.log(err);
                toast.error('Server Error, Try Later !!', toastErrorStyle)
            }
        }
        return (
            <>
                <div className="joinRoom flex">
                    <div className="joinTime flex">
                        <i className="fa-solid fa-key"></i>
                    </div>
                    <h1>Join a Room</h1>
                    <p>Enter the 4-digit code to enter room</p>
                    <div className="inputs flex">
                        <input type="number" max={1} ref={inputOne} onChange={() => inputTwo.current.focus()} />
                        <input type="number" max={1} ref={inputTwo} onChange={() => inputThree.current.focus()} />
                        <input type="number" max={1} ref={inputThree} onChange={() => inputFour.current.focus()} />
                        <input type="number" max={1} ref={inputFour} onChange={() => button.current.focus()} />
                    </div>
                    <Button id={"joinRoom"} ref={button} onClick={() => { joinRoom() }}>Join Room</Button>
                </div>
            </>
        )
    }
