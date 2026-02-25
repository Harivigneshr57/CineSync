import ProfileHeader from "./ProfileHeader.jsx";
import RecentlyWatched from "./RecentlyWatched.jsx";
import Favourites from "./Favourites.jsx";
import './profile.css'
import SideBar from "../Home/SideBar.jsx"; 
import { useState } from "react";
import EditProfile from "./EditProfile.jsx";

export default function Profile() {

  const [isEditable,setEdit] = useState(false);
  const[username,setuserName]=useState("");
  const[bio,setbio]=useState("");
  const[image,setimage]=useState("");

  function displayedit(){
    setEdit(true);
  }

  function hideedit(){
    setEdit(false);
  }
  return (
    <main className="page">
      <SideBar></SideBar>
      <ProfileHeader setuserName={setuserName} username={username} bio={bio} image={image} displayedit={displayedit}/>
      <Favourites></Favourites> 
      {/* <RecentlyWatched /> */}
      <EditProfile defusername={username} defimage={image} defbio={bio} setimage={setimage} setuserName={setuserName} setbio={setbio}  isEditable={isEditable} hideedit={hideedit}>
      </EditProfile>
    </main>
  );
}