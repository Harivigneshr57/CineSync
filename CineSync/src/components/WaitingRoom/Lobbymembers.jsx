import ConnectedMembers from "./Connectedmembers";

export default function Lobbymembers({connectedmemebers}){
    return <>
        <div className="lobby-members">
            <h2 style={{borderBottom:"1px solid var(--border)",padding: '2rem',fontSize: '1.65rem'}}>Lobby members</h2>
            <ConnectedMembers connectedmemebers={connectedmemebers}></ConnectedMembers>
        </div>
    </>
}