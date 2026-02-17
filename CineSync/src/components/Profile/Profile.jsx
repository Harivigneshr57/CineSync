import ProfileHeader from "./ProfileHeader.jsx";
import RecentlyWatched from "./RecentlyWatched.jsx";
import Favourites from "./Favourites.jsx";
import './profile.css'
import SideBar from "../Home/SideBar.jsx"; 

export default function Profile() {
  return (
    <main className="page">
      <SideBar></SideBar>
      <ProfileHeader />
      <Favourites></Favourites>
      <RecentlyWatched />
    </main>
  );
}