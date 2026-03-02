import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../Login-SignIn/UserContext";
import logo from "../../assets/logo.png";
import Button from "../Login-SignIn/Button";

export default function SideBar({ isinvite }) {
    const [showExitDiv,setShowExitDiv]=useState(false);
    const navigate = useNavigate();
    const { isRoom, setAsRoom } = useContext(UserContext);

    const [showExitModal, setShowExitModal] = useState(false);
    const [nextRoute, setNextRoute] = useState(null);
    const [exitVal,setExitVal]=useState(true);

    function handleNavigation(path) {
        if(!showExitDiv){
            if (isRoom) {
                setNextRoute(path);
                setShowExitModal(true);
            } else {
                navigate(path);
            }
        }
    }
    function logout(){
        navigate("/");
        localStorage.clear();
        setShowExitDiv(false);
    }
    function confirmExit() {
        setAsRoom(false);
        localStorage.removeItem("Roomname");
        setShowExitModal(false);
        navigate(nextRoute);
    }

    useEffect(()=>{
        let user=localStorage.getItem("Username");
        let host=localStorage.getItem("HostName");
        if(user===host){
         setExitVal(true)
        } 
        else{
         setExitVal(false);
        }
       },[]);
    return (
        <>
            <aside>
                <div className="logo flex">
                    <img src={logo} alt="logo" />
                </div>

                <div className="main-nav">
                    <Button icon={<i className="fa-solid fa-house"></i>} onClick={() => handleNavigation("/home")}>
                        Home
                    </Button>

                    <Button icon={<i className="fa-solid fa-compass"></i>} onClick={() => handleNavigation("/discover")}>
                        Discover
                    </Button>

                    <Button icon={<i className="fa-solid fa-users"></i>} onClick={() => handleNavigation("/social")}>
                        Social
                    </Button>

                    <Button icon={<i className="fa-solid fa-door-open"></i>} onClick={() => handleNavigation("/room")}>
                        Room
                    </Button>
                </div>

                <div className="user-nav">
                    <Button onClick={() => handleNavigation("/notification")}
                        icon={
                            <div className="bell-wrapper">
                                <i className="fa-solid fa-bell"></i>
                                {isinvite && <div className="notification-dot"></div>}
                            </div>
                        }
                    >
                        Notify
                    </Button>

                    <Button icon={<i className="fa-solid fa-circle-user"></i>} onClick={() => handleNavigation("/profile")}>
                        Profile
                    </Button>
                    <Button icon={<i class="fa-solid fa-arrow-right-from-bracket"></i>} onClick={() => setShowExitDiv(true)}>
                        LogOut
                    </Button>
                </div>
            </aside>

            {showExitModal && (
                <div className="total-exit-div">
                    <div className="exit-overlay">
                        <div className="exit-modal-box">
                            <div className="exit-header">
                                <i className="fa-solid fa-door-open exit-icon"></i>
                                <h3>Leave Room</h3>
                            </div>
                            <p className="exit-text">
                                If you leave now, you will exit the current watch party.
                            </p>

                            <div className="exit-buttons">
                                <button className="cancel-btn" onClick={() => setShowExitModal(false)}>
                                    Cancel
                                </button>

                                <button className="confirm-btn" onClick={confirmExit}>
                                    Yes, Leave
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            )}

            {showExitDiv&&(
                <div className="total-exit-div">
                <div className="logout-overlay">
                    <div className="logout-modal-box">
                        <div className="exit-header">
                            <i className="fa-solid fa-door-open exit-icon"></i>
                            <h3>Are you sure to logout?</h3>
                        </div>

                        <div className="exit-buttons">
                            <button className="cancel-btn" onClick={() => setShowExitDiv(false)}>
                                Cancel
                            </button>

                            <button className="confirm-btn" onClick={logout}>
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}
