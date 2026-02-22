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
  useEffect(()=>{
    const fetchProfile=async()=>{
      await fetch("https://cinesync-3k1z.onrender.com/getMyProfile",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username:user.username, user_id:user.id})
      }).then((res)=>res.json())
      .then((data)=>{
        console.log("------------------");
        console.log(data.message[0])
        setImage(data.message[0].image);
        setName(data.message[0].username);
        setbio(data.message[0].bio);
      })
      .catch((err)=>console.log(err))
    }
    fetchProfile();
  },[user]);
  console.log(image,name,bio);
  return (
    <section className="profile-header">
      <div className="profile-info">
        <div className="profile-section">
        <div className="avatar" >
        <div
  className="imageholder" style={{backgroundImage: `url(${props.image || image || def})`}}></div> </div>
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