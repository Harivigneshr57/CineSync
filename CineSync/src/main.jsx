import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import MainRoom from './components/GroupWatching/RoomWatch.jsx';

function isAuthenticated() {
  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload?.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/signin" replace />;
}

function PublicOnlyRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/home" replace /> : children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        
        <Toaster position="top-right" reverseOrder={false} />
        
        <Routes>
        <Route path="/" element={<PublicOnlyRoute><App /></PublicOnlyRoute>} />
          <Route path="/signin" element={<PublicOnlyRoute><SignIn /></PublicOnlyRoute>} />

          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/social" element={<ProtectedRoute><SocialHub /></ProtectedRoute>} />
          <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/single" element={<ProtectedRoute><SinglePersonMovie /></ProtectedRoute>} />
          <Route path="/room" element={<ProtectedRoute><RoomType /></ProtectedRoute>} />
          <Route path="/createRoom" element={<ProtectedRoute><Room /></ProtectedRoute>} />
          <Route path="/waitingRoom" element={<ProtectedRoute><WaitingRoom /></ProtectedRoute>} />
          <Route path="/notification" element={<ProtectedRoute><Notify /></ProtectedRoute>} />
          <Route path='/mainRoom' element={<ProtectedRoute><MainRoom /></ProtectedRoute>} />
        </Routes> 

      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
)