import defaultImg from "../../assets/onnapak.png";
export default function Invitation({image,userName,bio,onReject,onAccept}) {
    return (
        <>
            <div className="invitationDiv">
                <div className="detailInvitation">
                   
                    <div ><img className="invitationImage"src={(image || defaultImg)} /></div>
                    <div>
                        <h3 className="invitationTitle">{userName}</h3>
                        <p className="invitationPtag">{bio}</p>
                    </div>

                </div>
                <div className="butDivAR">
                    <button id="reject-btn" onClick={onReject}>✖</button>
                    <button id="accept-btn" onClick={onAccept}>✔</button>
                </div>
            </div>

        </>
    )
}
