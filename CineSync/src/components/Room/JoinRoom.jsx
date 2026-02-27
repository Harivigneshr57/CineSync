import { useRef, useState } from 'react'
import Button from '../Login-SignIn/Button';
import { socket } from '../Home/socket';
import toast from 'react-hot-toast';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../Login-SignIn/UserContext";

export default function JoinRoom() {
    let inputOne = useRef(null);
    let inputTwo = useRef(null);
    let inputThree = useRef(null);
    let inputFour = useRef(null);
    let button = useRef(null);
    const navigate = useNavigate();
    const { user, setAsRoom } = useContext(UserContext);

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
        let roomcode = inputOne.current.value + "" + inputTwo.current.value + "" + inputThree.current.value + "" + inputFour.current.value
        console.log(roomcode);

        if (roomcode.length == 4) {

            let data;
            try {
                const response = await fetch(
                    "https://cinesync-3k1z.onrender.com/getRoomName",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            roomCode: roomcode
                        })
                    }
                )
                    .then(res => res.json())
                    .then(dat => data = dat);
                    console.log(data.movie_url,data.movie_poster);
                    localStorage.setItem('MovieImage',data.movie_poster);
                    localStorage.setItem('movieVideo',data.movie_url);
                    localStorage.setItem('MovieName',data.title)
                console.log("Room Name " + data.roomname.length);

                if (data.roomname.length) {
                    console.log(data.roomname[0].RoomName);
                    toast.success("You joined the room", toastSuccessStyle);
                    // socket.emit("joinRoom", data.roomname[0].RoomName, localStorage.getItem("Username"));
                    localStorage.setItem("Roomname", data.roomname[0].RoomName);

                    let res = await fetch("https://cinesync-3k1z.onrender.com/roomcheck", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            roomCode: roomcode
                        })
                    })
                    let results = await res.json();
                    
                    if (results.result.length === 1) {
                        console.log(localStorage.getItem("Roomname"));
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
                    toast.error("No Rooms Exist in this code !!", toastErrorStyle);
                }
            } catch (err) {
                console.log(err);
                toast.error('Server Error, Try Later !!', toastErrorStyle)
            }
        }
        else {
            toast.error("Room code atleast contain 4 numbers", toastErrorStyle);
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