import { useContext, useEffect, useState } from 'react';
import { UserContext } from "../Login-SignIn/UserContext";
import Friend from './Friend';

import { socket } from "../Home/socket";

export default function InviteFriends(props) {
    const { user } = useContext(UserContext);
    const [friends, setFriends] = useState([]);
    const [friendToInvite, setFriend] = useState("");

    useEffect(() => {
        if (!user) return;

        fetch("http://localhost:3458/allFriends", {
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

    function handleFriend(friendname) {
        console.log("reciever_name: " + friendname + " movie_name: " + props.movie.title + " sender_name: " + localStorage.getItem("Username") + " Room code :" + props.code + " Room name: " + props.room);
        setFriend(friendname);
        socket.emit("sendInvite",props.room,localStorage.getItem("Username"),props.movie.title,friendname);
        sendNotification(props.room, localStorage.getItem("Username"), friendname, props.movie.title);
    }

    async function sendNotification(room_name, sender_name, reciever_name, movie_name) {

        try {

            const response = await fetch("http://localhost:3458/sendInvitation", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    room_name,
                    sender_name,
                    reciever_name,
                    movie_name
                })

            });

            const data = await response.json();

            console.log(data);

        }
        catch (err) {

            console.log(err);

        }
    }

    return (
        <>
            <h6>INVITE FRIENDS</h6>
            {friends.map((a, i) => {
                return <Friend arr={a} key={i} handleFriend={handleFriend}></Friend>
            })}
        </>
    )
}