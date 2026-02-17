import { createContext, useState } from "react";

export const MovieContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({title:"",vdoUrl:"",});
    function changeUser(id, username){
        setUser({id,username})
    }
    return (
        <MovieContext.Provider value={{ user,changeUser }}>
            {children}
        </MovieContext.Provider>
    );

}