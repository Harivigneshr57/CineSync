import { useEffect, useState } from "react";
import { UserContext } from "../Login-SignIn/UserContext";
import { useContext } from "react";
import SuggestUser from "./SuggestUser";

export default function TopBar() {

    const { user } = useContext(UserContext);



    const [inputval, setInputval] = useState("");
    const [friends, setFriends] = useState([]);
    const [users, setUsers] = useState([]);
    const [showDiv, setShowDiv] = useState(false);
    useEffect(() => {
        if (!user || !user.username || user.username.trim() === "") return;

    
        const fetchData = async () => {
            try {
                console.log("Fetching for:", user.username);
                const usersRes = await fetch("http://localhost:3458/allUsers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: user.username })
                });
    
                const usersData = await usersRes.json();
                console.log("Users received:", usersData);
                setUsers(usersData.result || []);
    
                console.log("Sending username:", user.username);

                const friendsRes = await fetch("http://localhost:3458/allfriends", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: user.username })
                });
    
                const friendsData = await friendsRes.json();
                console.log("Friends received:", friendsData);
                setFriends(friendsData.result || []);
    
            } catch (err) {
                console.log("Error fetching data:", err);
            }
        };
    
        fetchData();
    
    }, [user?.username]);
    



    useEffect(() => {
        console.log("friends updated", friends);
    }, [friends]);
    function searchFriend(e) {
        const value = e.target.value;
        setInputval(value);
        console.log(value);

        if (!value.trim()) {
            setShowDiv(false);
        } else {
            setShowDiv(true);
        }
    }

    const filterNameArray = users?.filter((ele) => ele.username.toLowerCase().includes(inputval.toLowerCase()));

    return (
        <>
            <div id="socialTopBar">

                <h2>Social Hub</h2>
                <div style={{ width: "30%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <input onChange={searchFriend} type="text" id="searchInSocial" placeholder="Search your friends or add friend..."></input>


                </div>
            </div>
            <div style={{ display: showDiv ? "block" : "none" }} id="dropdown">
                {filterNameArray.map((ele) => {
                    const isFriend = friends.some(
                        friend => friend.username === ele.username
                    );

                    return (
                        <SuggestUser
                            key={ele.username}
                            img={ele.image}
                            name={ele.username}
                            bio={ele.bio}
                            isFriend={isFriend}
                        />
                    );
                })}


            </div>
        </>
    )
}