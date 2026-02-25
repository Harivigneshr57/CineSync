import { useRef, useState } from "react";
import SideBar from "../Home/SideBar";
import TopBar from "./Topbar";
import VideoArea from "./VideoArea";
import toast from "react-hot-toast";
import './group.css';
import Chat from "./Chat";
import Participants from "./Participants";
import { socket } from "../Home/socket";
import { useEffect } from "react";

export default function RoomWatch() {
      /* ===== SELF CONTROL STATES ===== */
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const localVideo = useRef(null);

  const toastErrorStyle = {
    style: {
      borderRadius: "1rem",
      background: "var(--error)",
      color: "white",
      fontWeight: 600,
      minWidth: "26rem",   
    },
    iconTheme: {
      primary: "white",
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
  /* ===== PER USER MUTE ===== */
  const [mutedUsers, setMutedUsers] = useState({});
    const [chat, setChat] = useState(false);
    const [party,setParty] = useState(false); 
    let video = useRef(null);
    let container = useRef(null);

    const [currentmessage, setmessage] = useState("");
    const [allmessages, setmessages] = useState([]);

    const chatBoxRef = useRef(null);

    const room = localStorage.getItem("Roomname");
    const username = localStorage.getItem("Username");

    socket.on('frndLeave',msg=>{
        toast(
            <p><i class="fa-regular fa-message"></i>{msg}</p>,
             {
               style: {
                background: "#5a83a3",
                color: "#fff",
                display:"flex",
                gap:"0.5rem"
               }
             }
           );
    })
    function sendMessageToRoom() {
        console.log("Message: "+currentmessage)
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
            <div className="roomWatch">
                <SideBar></SideBar>
                <TopBar></TopBar>
                <VideoArea reference={video} references={container} chat={chat} setChat={setChat} party={party} setParty={setParty} micOn={micOn} setMicOn={setMicOn} camOn={camOn} setCamOn={setCamOn} mutedUsers={mutedUsers} setMutedUsers={setMutedUsers} localVideo={localVideo}></VideoArea>
                <Chat allmessages = {allmessages}chat={chat}setmessage={setmessage} setChat={setChat} chatBoxRef ={chatBoxRef} sendMessageToRoom={sendMessageToRoom} setParty={setParty}></Chat>
                <Participants chat={chat} setChat={setChat} party={party} setParty={setParty} micOn={micOn} setMicOn={setMicOn} camOn={camOn} setCamOn={setCamOn} mutedUsers={mutedUsers} setMutedUsers={setMutedUsers} localVideo={localVideo}></Participants>
            </div>
        </>
    )
}
