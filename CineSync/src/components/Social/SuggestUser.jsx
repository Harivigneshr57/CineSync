import { useContext,useState } from "react";
import { UserContext } from "../Login-SignIn/UserContext";
import Msg from '../Login-SignIn/ErrorMsg';
import def from './def.png';
import toast from "react-hot-toast";


export default function SuggestUser({img,name,bio,isFriend}){
    const { user } = useContext(UserContext);
    const [showMsg, setShowMsg] = useState(false);
    const [isSent,setSend]=useState(false);

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

    const reqFriend = async () => {
        console.log('hi');
        console.log("SENDING:", {
            username: user.username,
            friendname:name
          });

        let val=await fetch("https://cinesync-3k1z.onrender.com/sendRequest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username :user.username,friendname:name }),
        }).then((res)=>res.json())
        .then((data)=>{
            if(data.message ==="Request already sent"){
                toast.success('Request Already Sent!!');
            }
            else{
                setSend(false);
            }    
            toast.success('Request Sent Successfully!!')
            
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
        </div>
    )
}