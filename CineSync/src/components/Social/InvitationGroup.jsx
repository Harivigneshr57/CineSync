import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Login-SignIn/UserContext';
import Invitation from './Invitation'

export default function InvitationGroup({onAcceptDone}) {
    const { user } = useContext(UserContext);
    const [invitations, setInvitation] = useState([]);



    async function fetching() {
        if (!user) return;
        
        try {

            const req = await fetch("http://localhost:3458/reqFriends", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username })
            })
            const data = await req.json();
            
            setInvitation(data.result || []);
            
        }
        catch (err) {
            console.log("Error occured ", err);
        }
    }

    async function rejectInvitation(friendname) {
        try {
            const reject = await fetch("http://localhost:3458/rejectRequest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username, friendname: friendname })
            }).then((res)=>res.json())
            .then((data)=>console.log(data))
            .catch((err)=>console.log(err));
            fetching();

        }
        catch (err) {
            console.log(err);
        }

    }
    async function acceptInvitation(friendname) {
        try {
            console.log(user.username);
            console.log(friendname);
            const reject = await fetch("http://localhost:3458/acceptRequest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username, friendname: friendname })
            }).then((res)=>res.json())
            .then((data)=>console.log(data))
            .catch((err)=>console.log(err));
            fetching();
            onAcceptDone();
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (!user) return;
    
        const loadInvitations = async () => {
            await fetching();
        };
    
        loadInvitations();
    }, [user]);
    useEffect(() => {
        console.log("Updated invitations:", invitations);
    }, [invitations]);
        
    return (
        <>
           {invitations.length === 0 ? (
                <div style={{width:"50rem",borderRadius:"15px",padding:"3rem",display:"flex",justifyContent:"center",alignItems:"center"}}>
                    <p style={{textAlign:'center'}}>No invitations</p>
                </div>
            ) : (
                invitations.map((inv) => (
                    <div key={inv.username}>
                        <Invitation
                            userName={inv.username}
                            bio={inv.bio}
                            image={inv.image}
                            onReject={() => rejectInvitation(inv.username)}
                            onAccept={() => acceptInvitation(inv.username)}
                        />
                    </div>
                ))
                
            )}

        </>
    )
}
