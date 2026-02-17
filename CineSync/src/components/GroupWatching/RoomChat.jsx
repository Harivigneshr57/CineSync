import RightPanel from './MovieChat';
export default function RoomChat({setOpen,chatOpen}){
    return (
        <>
            <div className="roomChat-icon flex" onClick={()=>{setOpen(false)}} style={chatOpen?{display:'flex'}:{display:'none'}}>
                <i class="fa-brands fa-rocketchat"></i>
            </div>
            <RightPanel setOpen={setOpen} chatOpen={chatOpen}></RightPanel>
        </>
    )
}