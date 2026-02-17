import TopBar from "./TopBar"
import PendingInvite from "./PendingInvite"
import AllFriends from "./AllFriends"
import SideBar from "../Home/SideBar"
import Chathead from "./Chathead"
import Chatmeassages from "./Chatmessages"
import './social.css'
import { useState ,useRef,useEffect} from "react"

export default function SocialHub() {
    const [refresh, setRefresh] = useState(false);
    const [currentUser, setUser] = useState("");
    const [chatBox, setchatBox] = useState(false);
    const [messageArray, setArray] = useState([]);
    let username = localStorage.getItem("Username");

    function handleUser(friend) {
        setUser(friend);
        console.log("Username: "+username+" | friend: "+friend);
        console.log("Hello " + friend);
    }

    function displayChat() {
        setchatBox(true);
    }

    function hideChat() {
        setchatBox(false);
    }


   useEffect(()=>{
    if (!currentUser) return;

    async function rendermessage() {
        try {
            const response = await fetch("https://cinesync-3k1z.onrender.com/getmessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    friend:currentUser
                })
            });
            const data = await response.json();
            console.log(data);
            setArray(data.message);
        }
        catch (err) {
            console.log("Error in get message");
        }
    }
    rendermessage();
   },[currentUser])


    return (
        <>
            <div id="socialContainer">
                <SideBar></SideBar>
                <div id="socialMain">
                    <TopBar></TopBar>
                    <div className="social-friends-column">
                        <AllFriends handleUser={handleUser} refresh={refresh} currentUser={currentUser} displayChat={displayChat} ></AllFriends>
                        <PendingInvite onAcceptDone={() => setRefresh(!refresh)}></PendingInvite>
                    </div>
                    <div className="chat" style={{ display: chatBox ? 'block' : 'none' }} >
                        <Chathead hideChat={hideChat} currentUser={currentUser}></Chathead>
                        <Chatmeassages currentUsers={currentUser} messageArray={messageArray} setArray={setArray}></Chatmeassages>
                    </div>
                </div>
            </div>
        </>
    )
}