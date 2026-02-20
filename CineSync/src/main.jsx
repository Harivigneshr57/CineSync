import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Toaster} from 'react-hot-toast';
import App from "./App.jsx";
import SignIn from "./components/Login-SignIn/SignIn";
import Home from "./components/Home/Home";
import SocialHub from "./components/Social/SocialHub.jsx";
import Discover from "./components/Discover/Discover";
import Profile from "./components/Profile/Profile.jsx"
import { UserProvider } from "./components/Login-SignIn/UserContext.jsx";
import SinglePersonMovie from "./components/Single/SinglePersonMovie.jsx";
import RoomType from "./components/Room/RoomType.jsx";
import Room from "./components/Room/Room.jsx";
import WaitingRoom from './components/WaitingRoom/WaitingRoom.jsx';
import Notify from './components/Notify/Notify.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        
        <Toaster position="top-right" reverseOrder={false} />
        
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/social" element={<SocialHub />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/single" element={<SinglePersonMovie />} />
          <Route path="/room" element={<RoomType />} />
          <Route path="/createRoom" element={<Room />} />
          <Route path="/waitingRoom" element={<WaitingRoom/>}></Route>
          <Route path="/notification" element={<Notify/>}></Route>
        </Routes>

      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
)