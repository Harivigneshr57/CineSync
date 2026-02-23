import { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({username:""});
    const [movie,setMovie]=useState({});
    const [movieImg,setMovieImg]=useState({movie_img:"",title:""});
    const [roomDetails, setRoomDetails] = useState([]);
    const [roomVideo,setRoomVideo] = useState({video:''})
    async function changeUser(){
        setUser({username:localStorage.getItem('Username')});
    }
    function changeMovie(movie_url,title){
        setMovie({movie_url,title});
    }
    function changeRoomDetail(arrayOfRooms){
        setRoomDetails(arrayOfRooms);
    }
    function changeMovieImage(movie_img){
        setMovieImg({movie_img});
    }
    useEffect(() => {
        changeUser();
      }, [window.onload]);
      
      return (
        <UserContext.Provider value={{ 
            user,
            movie,
            setMovie,
            roomDetails,
            setRoomDetails,     
            changeUser,
            changeMovie,
            movieImg,
            changeMovieImage,
            changeRoomDetail,
            roomVideo,
            setRoomVideo
        }}>
            {children}
        </UserContext.Provider>
    );

}
