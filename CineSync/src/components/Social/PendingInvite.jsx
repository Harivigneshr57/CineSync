import InvitationGroup from './InvitationGroup'
export default function PendingInvite({onAcceptDone}) {

    return (
        <>
            <div style={{marginBottom:"3rem"}} id="pendingInviteDiv">
                <div id="pendingTop">
                    <h3>Pending Requests</h3>

                </div>
                <div id="pendingMain">
                    <InvitationGroup onAcceptDone={onAcceptDone}></InvitationGroup>
                </div>
            </div>
        </>
    )
}
