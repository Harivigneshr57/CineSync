import StatsBar from "./StatsBar.jsx";
import Button from "../Login-SignIn/Button.jsx";
import def from '../../assets/onnapak.png'
import { UserContext } from "../Login-SignIn/UserContext";
import { use, useContext } from "react";

export default function ProfileHeader() {
  const {user,changeUser} = useContext(UserContext);
  return (
    <section className="profile-header">
      <div className="profile-info">
        <div className="profile-section">
        <div className="avatar" >
            <div className="imageholder" style={{backgroundImage:`url(${def})`}}></div>
        </div>
        {/* <span className="pro-badge">PRO</span> */}
        <h3>{localStorage.getItem('Username')}</h3>

        </div>
        <div className="Biodetails">
          <p className="tagline">
            {user.bio}
          </p>
          <StatsBar />
        </div>
      </div>
      <div>
           <Button className="Edit-Profile">Edit Hub</Button>
      </div>
    </section>
  );
  }