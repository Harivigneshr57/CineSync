import { useContext, useEffect, useState } from 'react';
import { UserContext } from "../Login-SignIn/UserContext";
import Friend from './Friend';
export default function InviteFriends(){
    const { user } = useContext(UserContext);
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        if (!user) return;
        fetch("https://cinesync-3k1z.onrender.com/allFriends", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: localStorage.getItem('Username') })
        }).then((res) => {
            return res.json();
        }).then((data) => {
            return setFriends(data.result || []);
        })
        console.log(friends);

    }, [user]);
    return(
        <>
            <h6>INVITE FRIENDS</h6>
            {friends.map((a,i)=>{
                return <Friend arr = {a} key={i} ></Friend>
            })}
        </>
    )
}