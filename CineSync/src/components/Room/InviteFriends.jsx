import { useContext, useEffect, useState } from 'react';
import { UserContext } from "../Login-SignIn/UserContext";
import Friend from './Friend';

import { socket } from "../Home/socket";

export default function InviteFriends(props) {
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

    function handleFriend(friendname) {
        const movieName = props.movie?.title || props.movie?.name;
        console.log("receiver_name: " + friendname + " movie_name: " + movieName + " sender_name: " + localStorage.getItem("Username") + " Room code :" + props.code + " Room name: " + props.room);
        setFriend(friendname);
        socket.emit("sendInvite", props.code, localStorage.getItem("Username"), movieName, friendname, props.movie.video, props.movie.url);
        sendNotification(props.room, props.code, localStorage.getItem("Username"), friendname, movieName, props.movie.url, props.movie.video);
    }

    async function sendNotification(room_name, room_code, sender_name, receiver_name, movie_name, image, video) {

        try {

            const response = await fetch("https://cinesync-3k1z.onrender.com/sendInvitation", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    room_name,
                    sender_name,
                    receiver_name,
                    reciever_name: receiver_name,
                    room_code,
                    movie_name,
                    video,
                    image
                })

            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || "Failed to send invitation");
            }

            console.log("Invitation sent", data);

        }
        catch (err) {

            console.log("Error while sending invitation", err);

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