import Button from "../Login-SignIn/Button"
export default function TopBar(){
    return(
        <>
            <div className="topBar">
                <h5>The Grand Budapest Hotel</h5>
                <div className="topButtons">
                    <Button id={'roomExit'}><i class="fa-solid fa-arrow-right-from-bracket"></i> Exit</Button>
                </div>
            </div>
        </>
    )
}