import { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({username:""});
    const [movie,setMovie]=useState({movie_url:"",title:""});
    async function changeUser(){
        setUser({username:localStorage.getItem('Username')});
    }
    function changeMovie(movie_url,title){
        setMovie({movie_url,title});
    }
    function changeRoomDetail(arrayOfRooms){
        setRoomDetails(arrayOfRooms);
    }
    useEffect(() => {
        changeUser();
      }, [window.onload]);
      
    return (
        <UserContext.Provider value={{ user,movie,changeUser,changeMovie }}>
            {children}
        </UserContext.Provider>
    );

}
