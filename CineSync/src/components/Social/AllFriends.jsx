import { useContext, useEffect, useState } from 'react';
import { UserContext } from "../Login-SignIn/UserContext";
import def from "../../assets/onnapak.png";


export function FriendPanel({ currentUser, handleUser, displayChat,refresh }) {


    const { user } = useContext(UserContext);
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        if (!user) return;
        // console.log("hi===============",user);
        fetch("https://cinesync-3k1z.onrender.com/allFriends", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user.username })
        }).then((res) => {

            // console.log(res);
            return res.json();
        }).then((data) => {
            // console.log("FULL RESPONSE:", data);
        
            if (data.result) {
                setFriends(data.result);
            } else {
                setFriends([]);   
            }
        })
        
    }, [user, refresh]);

 
    return (
        <>
            <div id="friendsPanel">
                {friends.length==0?(
                    <p style={{textAlign:'center'}}> No Friends</p>
                ):(
                    friends.map((friend, i) => (
                        <MyFriend 
                           img={friend.image}
                           name={friend.username}
                           bio={friend.bio}
                           handleUser={handleUser}
                           key={i}
                           displayChat={displayChat}
                        />
                     ))
                     
                )}
                
            </div>
        </>
    )
}


export function MyFriend(props) {
    console.log(props,"props");


    return (
        <>
            <div className="myFriend">
            <img
  src={props.img ? `data:image/png;base64,${props.img}` : def}
  id="social-profile-image"
/>
                <h3>{props.name}</h3>
                <p style={{ color: "#5a83a3" }}>{props.bio}</p>
                <button id="inviteToWatch" onClick={() => { props.displayChat(); props.handleUser(props.name) }}>Chat  <i className="fa-solid fa-message"></i></button>
            </div>
        </>
    )
}
export default function AllFriends({ currentUser, handleUser, displayChat, refresh }) {
    return (
        <>
            <div id="allFriendsBox">
                <div style={{marginBottom:"3rem"}} id="headOfAllFr">
                    <h3>All Friends</h3>
                </div>
                <div className='social-allfriends-panel'>
                    <FriendPanel refresh={refresh} currentUser={currentUser} handleUser={handleUser} displayChat={displayChat}></FriendPanel>
                </div>
            </div>
        </>
    )
}