import Button from "../Login-SignIn/Button"
import def from "../../assets/onnapak.png";
export default function Friend({arr}){
    // let onlineUsers;
    // fetch('http://localhost:3458/users')
    // .then((res)=>{
    //     return res.json
    // })
    // .then((res)=>{
    //     console.log(res.users);
    //     return onlineUsers = res.users;
    // })  
    

    // function getStatus(username){
    //     for(let i=0;i<onlineUsers.length;i++){
    //         if(onlineUsers[i].username == username){
    //             return "Online"
    //         }
    //     }
    //     return "Offline"
    // }

    return(
        <>
            <div className="friend">
                <div className="aboutFriend">
                    <img src={arr.image?arr.users.image:def} alt="" />
                    <div className="nameOfFriend">
                        <h3>{arr.username}</h3>
                        <p></p>
                    </div>
                </div>
                <Button id={'invite'}>Invite</Button>
            </div>
        </>
    )
}