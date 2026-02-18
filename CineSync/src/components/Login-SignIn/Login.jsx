import bgImage from "../../assets/image.png";
import Button from "./Button";
import { UserContext } from "./UserContext";
import toast from "react-hot-toast";
import { useState ,useContext, useRef} from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){

    const ref = useRef(null);

    let navigate = useNavigate();
    function navigates(){
        navigate("/signIn");
    }

    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const {user,changeUser} = useContext(UserContext);
    const [loading,setLoading] = useState(false);
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
            ref.current.disabled = false;
          } 
          else if (data.message === "Signup successful") {
            toast.success("SignUp Successful, you can SignIn !!", toastSuccessStyle);
            navigates();
            ref.current.disabled = false;
          } 
          else {
            toast.error("Server Error !!", toastErrorStyle);
            ref.current.disabled = false;
          }
      
        } catch (error) {
          toast.error("Network Error !!", toastErrorStyle);
          ref.current.disabled = false;
        
        }
      }      
      
       

      function loginCheck() {

        if(loading)
        return;

        // USERNAME VALIDATION
        if (!username.trim()) {
          toast.error("Username should not be empty");
          return;
        }
      
        if (username.length < 5 || username.length > 20) {
          toast.error("Username must be between 5 and 20 characters");
          return;
        }
      
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(username)) {
          toast.error("Username must start with a letter and contain only letters, numbers, or underscore");
          return;
        }
      
        // PASSWORD VALIDATION
        if (!password.trim()) {
          toast.error("Password should not be empty");
          return;
        }
      
        if (password.length < 8) {
          toast.error("Password must be at least 8 characters long");
          return;
        }
      
        if (/\s/.test(password)) {
          toast.error("Password should not contain spaces");
          return;
        }
      
        if (!/[A-Z]/.test(password)) {
          toast.error("Password must contain at least one uppercase letter");
          return;
        }
      
        if (!/[a-z]/.test(password)) {
          toast.error("Password must contain at least one lowercase letter");
          return;
        }
      
        if (!/[0-9]/.test(password)) {
          toast.error("Password must contain at least one number");
          return;
        }
      
        if (!/[!@#$%^&*]/.test(password)) {
          toast.error("Password must contain at least one special character (!@#$%^&*)");
          return;
        }
      
        // If everything passes
        setLoading(true);  // use state, not ref
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
                        <Button className="bigbutton" onClick={loginCheck} disabled={loading} id="signUp" ref={ref}>Sign Up</Button>
                    </div>
                    <p>Ready to Start? Use for free</p>
                </div>
            </main>
        </>
    )
} 