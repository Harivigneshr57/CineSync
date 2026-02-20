import Button from "../Login-SignIn/Button"
export default function TopBar(){
    return(
        <>
            <div className="topBar">
                <h5>The Grand Budapest Hotel</h5>
                <div className="topButtons">
                    <Button id={'roomInInvite'}><i class="fa-solid fa-user-plus"></i> Invite</Button>
                    <Button id={'roomExit'}><i class="fa-solid fa-arrow-right-from-bracket"></i> Exit</Button>
                </div>
            </div>
        </>
    )
}