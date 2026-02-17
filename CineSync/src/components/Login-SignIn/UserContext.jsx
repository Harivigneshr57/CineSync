import { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({id:"",username:""});
    const [movie,setMovie]=useState({movie_url:"",title:""});
    function changeUser(id, username){
        setUser({id,username})
    }
    function changeMovie(movie_url,title){
        setMovie({movie_url,title});
    }
    return (
        <UserContext.Provider value={{ user,movie,changeUser,changeMovie }}>
            {children}
        </UserContext.Provider>
    );

}
