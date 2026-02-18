import bgImage from "../../assets/image.png";
import Button from "./Button";
import { UserContext } from "./UserContext";
import toast from "react-hot-toast";
import { useState ,useContext} from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){

    let navigate = useNavigate();
    function navigates(){
        navigate("/signIn");
    }

    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const {user,changeUser} = useContext(UserContext);
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
      
      async function signup() {
        try {
          const response = await fetch("https://cinesync-3k1z.onrender.com/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
          });
      
          const data = await response.json();
          console.log(data);
      
          if (data.message === "User already exists") {
            toast.error("UserName Already Taken !!", toastErrorStyle);
          } 
          else if (data.message === "Signup successful") {
            toast.success("SignUp Successful, you can SignIn !!", toastSuccessStyle);
            navigates();
          } 
          else {
            toast.error("Server Error !!", toastErrorStyle);
          }
      
        } catch (error) {
          toast.error("Network Error !!", toastErrorStyle);
        }
      }      
      
       

    function loginCheck() {
      console.log('checking.........');
        if (username.length === 0) {
            toast.error('UserName Should Not Be Empty !!',toastErrorStyle)
            return;
        }
        if(username.trim().length < 5){
            toast.error('UserName Should Contain AtLeast 5 Char !!')
            return;
        }
      
        if (password.trim().length < 6) {
            toast.error('Password Should Contain AtLeast 6 Char !!',toastErrorStyle)
            return;
        }
      console.log('signup called ... ');
        signup();
      }

    return(
        <>
            <main className="main flex" style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="login flex">
                    <h1>Watch Movies Together,<span style={{color:"#517692"}}><br/>Perfectly Synced</span></h1>
                    <h6>Host private rooms, share laughs in real-time, and experience premium cinema with friends anywhere.</h6>
                    <input type="text" placeholder="Enter Your UserName" id="loginName" style={{width:"30rem"}}  value={username} onChange={(e) => setName(e.target.value)}/>
                    <div className="loginPass flex">
                        <input type="password" placeholder="Enter Your Password" id="loginPassword" style={{width:"24rem"}} value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                        <Button className="bigbutton" onClick={loginCheck} id="signUp">Sign Up</Button>
                    </div>
                    <p>Ready to Start? Use for free</p>
                </div>
            </main>
        </>
    )
} 