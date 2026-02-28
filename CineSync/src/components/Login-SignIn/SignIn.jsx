import bgImage from "../../assets/image.png";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useState,useContext } from "react";
import { UserContext } from "./UserContext";
import toast from "react-hot-toast";

export default function SignIn() {
    const [username,setName] = useState('');
    const [password,setPassword] = useState('');
    const {user,changeUser} = useContext(UserContext);
    const [loading, setLoading] = useState(false);
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
    async function signIn() {
      if (loading) return; // prevent double click
    
      setLoading(true);
    
      try {
        const response = await fetch(
          "https://cinesync-3k1z.onrender.com/signin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username,
              password
            })
          }
        );
    
        const data = await response.json();
    
        console.log("Signin response:", data);
    
        if (data.message === "User not found") {
          toast.error("Login Failed, No user Found !!", toastErrorStyle);
        }
        else if (data.message === "Invalid password") {
          toast.error("Login Failed, Invalid Password !!", toastErrorStyle);
        }
        else if (data.message === "Login successful") {
          localStorage.setItem("Username", data.username);
          toast.success("Login Successful !!", toastSuccessStyle);
          localStorage.setItem("token", data.accessToken);
          changeUser();
          home();
        }
        else {
          toast.error("Server Error, Try Later !!", toastErrorStyle);
        }
    
      } catch (err) {
        console.error(err);
        toast.error("Server Error, Try Later !!", toastErrorStyle);
      } finally {
        setLoading(false); 
      }
    }
      
    let navigate = useNavigate();
    function navigates(){
        navigate("/");
    }
    function home(){
        navigate("/home");
    }
    function signInCheck() {
      if (loading) return;
    
      if (!username.trim()) {
        toast.error("UserName Required !!", toastErrorStyle);
        return;
      }
    
      if (!password.trim()) {
        toast.error("Password Required !!", toastErrorStyle);
        return;
      }
    
      signIn();
    }
    return (
        <>
        <main className="login-page flex" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="top-logo flex">
                <img src={logo} alt="Onna Paarkalam Logo" style={{width:"4rem"}} />
                <h2>Cine <span style={{ color: "#517692" }}>Sync</span></h2>
            </div>
            <div className="login-card">
                <div className="center-logo">
                    <img src={logo} alt="logo" />
                </div>
                <h2>Welcome Back</h2>
                <p>Sign in to join the watch party</p>
                <div className="input-group">
                    <label>UserName</label>
                    <input type="text" placeholder="Enter Your UserName" id="signInEmail" onChange={(e)=>{setName(e.target.value)}}/>
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" placeholder="********" id="signInPass" onChange={(e)=>{setPassword(e.target.value)}}/>
                </div>
                <Button className="login-btn"id="login-btn"onClick={signInCheck}disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
                <p className="new-user">New here? <span id="join" onClick={navigates}>Join the club</span></p>
            </div>
        </main>
        </>
    );
}
