import Button from "./Button";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Header(){
    let navigate = useNavigate();
    function navigates(){
        navigate("/signIn");
    }
    return(
        <>
            <header className="flex1">
                 <div className="name flex">
                    <div className="logo flex">
                        <img src={logo} alt="logo" />
                    </div>
                    <h2>Cine <span style={{ color: "#517692" }}>Sync</span></h2>
                 </div>
                 <div className="headbuttons flex">
                    <Button className="smallbutton"><i className="fa-solid fa-globe"></i> English</Button>
                    <Button className="smallbutton" id="signInPage" onClick={navigates}>Sign In</Button>
                 </div>
            </header>
        </>
    )
}