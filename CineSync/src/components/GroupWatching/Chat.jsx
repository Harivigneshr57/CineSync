import Button from "../Login-SignIn/Button"
export default function Chat({chat,setChat}){
    function close(){
        setChat(false);
    }
    return(
        <>
            <div className="roomChats" style={chat?{display:"block"}:{display:"none"}}>
                <div className="roomHead">
                    <h2>ROOM NAME</h2>
                    <Button><i class="fa-solid fa-xmark" onClick={close}></i></Button>
                </div>
                <div className="roomBody">

                </div>
                <div className="roomFoot">
                    <input type="text" name="" id="" />
                    <Button><i className="fa-solid fa-paper-plane"></i></Button>
                </div>
            </div>
        </>
    )
}