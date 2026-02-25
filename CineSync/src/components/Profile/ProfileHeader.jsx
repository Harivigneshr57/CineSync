import StatsBar from "./StatsBar.jsx";
import Button from "../Login-SignIn/Button.jsx";
import def from '../../assets/onnapak.png'
import { UserContext } from "../Login-SignIn/UserContext";
import { useEffect, useContext, useState } from "react";

export default function ProfileHeader(props) {
  const {user,changeUser} = useContext(UserContext);
  const[image,setImage]=useState("");
  const[name,setName]=useState("");
  const [bio,setbio]=useState("");
  console.log("hii");
  console.log('\n\n');
  console.log(props.image);
  console.log('\n\n');
  console.log(`url(data:image/png;base64,${image})`);
  // console.log( `${props.image}?t=${Date.now()}`);
  
  const profileImage = props.image
  ? `url(${props.image})`
  : image
  ? `url(data:image/png;base64,${image})`
  : `url(${def})`;


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user.username) return;
        console.log('------------------------');
          console.log(user.username);
  
          const res = await fetch("https://cinesync-3k1z.onrender.com/getMyProfile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.username })
        });
  
        const data = await res.json();
        console.log("Response:", data);
  
        if (data.error) return;
        console.log("===================");
        console.log(data.message);
        if(data.message.image !==null){
          setImage(data.message.image);
        }
          props.setuserName(data.message.username)
          setName(data.message.username);
          setbio(data.message.bio);
        
  
      } catch (err) {
        console.log("Fetch error:", err);
      }
    };
  
    fetchProfile();
  }, [user.username]);
  console.log(image,name,bio);
  return (
    <section className="profile-header">
      <div className="profile-info">
        <div className="profile-section">
        <div className="avatar" >
        <div
  className="imageholder" style={{backgroundImage:profileImage}}></div> </div>
        {/* <span className="pro-badge">PRO</span> */}
        <h3>{props.username?props.username:name}</h3>

        </div>
        <div className="Biodetails">
          <p className="tagline">
            {props.bio?props.bio:bio}
          </p>
          <StatsBar />
        </div>
      </div>
      <div>
           <Button className="Edit-Profile" onClick={()=>{props.displayedit()}}>Edit Hub</Button>
      </div>
    </section>
  );
}