import Button from "../Login-SignIn/Button";
import WaitingRoomMessages from "../WaitingRoom/WaitingRoomMessages";
export default function Chat({setmessage, chat, setChat, allmessages ,chatBoxRef,sendMessageToRoom}) {
    function close() {
        setChat(false);
    }
    return (
        <>
            <div className="roomChats" style={chat ? { display: "block" } : { display: "none" }}>
                <div className="roomHead">
                    <h2>ROOM NAME</h2>
                    <Button><i class="fa-solid fa-xmark" onClick={close}></i></Button>
                </div>
                <div className="roomBody">
                    <div id="lobbyChatBox" ref={chatBoxRef}>
                        {allmessages.map((msg, i) => (
                            <WaitingRoomMessages key={i} role={msg.role} message={msg.message} />
                        ))}
                    </div>
                </div>
                <div className="roomFoot">
                    <input type="text" name="" id="" onChange={(e)=>{setmessage(e.target.value)}}/>
                    <Button onClick={sendMessageToRoom}><i className="fa-solid fa-paper-plane"></i></Button>
                </div>
            </div>
        </>
    )
}