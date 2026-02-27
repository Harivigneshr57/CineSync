import ConnectedMembers from "./Connectedmembers";

export default function Lobbymembers({connectedmemebers}){
    return <>
        <div className="lobby-members">
            <h2 style={{marginBottom:"2rem"},{borderBottom:"2px solid var(--border)"}}>Lobby members</h2>
            <ConnectedMembers connectedmemebers={connectedmemebers}></ConnectedMembers>
        </div>
    </>
}