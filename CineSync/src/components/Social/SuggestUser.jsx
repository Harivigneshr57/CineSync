import { useContext,useState } from "react";
import { UserContext } from "../Login-SignIn/UserContext";
import Msg from '../Login-SignIn/ErrorMsg';
import def from './def.png';


export default function SuggestUser({img,name,bio,isFriend}){
    const { user } = useContext(UserContext);
    const [showMsg, setShowMsg] = useState(false);
    const [isSent,setSend]=useState(false);
    const reqFriend = async () => {
        console.log('hi');
        console.log("SENDING:", {
            username: user.username,
            friendname:name
          });

        let val=await fetch("http://localhost:3458/sendRequest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username :user.username,friendname:name }),
        }).then((res)=>res.json())
        .then((data)=>{
            if(data.message ==="Request already sent"){
                setSend(true);
            }
            else{
                setSend(false);
            }
            setShowMsg(true);
    
            setTimeout(() => setShowMsg(false), 2000);
            
            console.log(data)})
        .catch((err)=>console.log(err));
      };

    return(
        <div className="suggestfriend" style={{cursor:"pointer"}}>
            <div className="detDiv">
            <img className="suggestImg" src={def}></img>
            <div>
                <h3>{name}</h3>
                <p id="bioOfSuggest">{bio}</p>
            </div>
            </div>
          
            {isFriend?"":<button className="sugBut" onClick={()=>reqFriend()}><i class="fa-solid fa-user-plus"></i></button>}
            <Msg show={showMsg} title={isSent ?"Request Already sent":"Request Succesfully Sended"} error="" style="Msg"></Msg>
        </div>
    )
}