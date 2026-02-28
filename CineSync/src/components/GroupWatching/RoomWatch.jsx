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
  socket.on("newJoin", (friend) => {
    toast.success(friend + " joined the room");
});
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
        console.log(msg+'msg');
        toast(
            <p>{msg}</p>,
             {
               style: {
                background: "var(--error)",
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
  socket.on("latejoin", (username) => {
    let currenttime = video.current.currentTime;
    toast.success("" + currenttime);
    console.log("current Time " + currenttime);
    socket.emit("toSetTime",currenttime,username);
    // fetching("Avengers end game");
})

socket.on("setCurrentTime",(time)=>{
    console.log("setting the time")
    console.log(time);
    video.current.currentTime =time
})
    useEffect(() => {
        const handleFriendLeave = (msg) => {
            console.log(msg + 'msg');
            toast(
                <p>{msg}</p>,
                 {
                   style: {
                    background: "var(--error)",
                    color: "#fff",
                    display:"flex",
                    gap:"0.5rem"
                   }
                 }
               );
        };
        async function fetching(moviename) {
          try {
            const response = await fetch(
              "https://rag-ai-bot-elpx.onrender.com/ai_chat/ask",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  prompt: "summary of Avengers End Game",
                  "x-api-key":
                    "99eedd3892d5a820b347415779c22655fcc7fc9b93991e9c08154bd633b18ca9"
                })
              }
            );
        
            if (!response.ok) throw new Error("API failed");
        
            const result = await response.json();
            console.log(result);
          } catch (err) {
            console.log("AI service unavailable:", err.message);
          }
        }
        fetching('avengers');
        socket.on('frndLeave', handleFriendLeave);

        return () => {
            socket.off('frndLeave', handleFriendLeave);
        };
    }, []);


    useEffect(() => {

        socket.on("messageFromRoom", (msgObj) => {
            setmessages(prev => [...prev, msgObj]);
            toast(
                <p>{msgObj.role} send a message !!</p>,
                 {
                   style: {
                    background: "#5a83a3",
                    color: "#fff",
                    display:"flex",
                    gap:"0.5rem"
                   }
                 }
               );
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

    socket.on("sendingInvite", (room_name, movie_name, sender_name) => {
      console.log("Invite received");
      console.log(room_name, movie_name, sender_name);
      setmessage(true);
  });

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
