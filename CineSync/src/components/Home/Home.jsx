import SideBar from "./SideBar"
import BigMovie from "./BigMovie"
import TrendingMovie from "./TrendingMovie"
import TamilBlockBustors from "./TamilBlockBusters"
import './home.css'
import { useEffect, useContext } from "react";
import { UserContext } from "../Login-SignIn/UserContext";
import { socket } from "./socket";


export default function Home() {
    const { changeRoomDetail } = useContext(UserContext);
    useEffect(() => {

        async function rendernotification() {
            try {
                const response = await fetch("https://cinesync-3k1z.onrender.com/getInvitations", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: localStorage.getItem("Username"),
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch notifications");
                }

                const data = await response.json();
                console.log(data.allnotification);
                changeRoomDetail(data.allnotification);
            }
            catch (err) {
                console.log("Error in get message");
            }
        }
        rendernotification();


        const username = localStorage.getItem("Username");

        socket.emit("addtoserver", username);

        socket.on("sendingInvite", (room_name, movie_name, sender_name) => {
            console.log("Invite received");
            console.log(room_name, movie_name, sender_name);
        });

        return () => {
            socket.off("sendingInvite");
        };

    }, []);


    return (
        <>
            <div className="home">
                <SideBar>
                </SideBar>
                <div className="mainDiv">
                    <BigMovie></BigMovie>
                    <TrendingMovie></TrendingMovie>
                    <TamilBlockBustors></TamilBlockBustors>
                </div>
            </div>
        </>
    )
}