import { useEffect, useState } from "react";
import Members from "./Members";
import { socket } from "../Home/socket";

function ConnectedMembers({  connectedmemebers = [] }) {
    // let connectedmemebers = [{ membername: "Hari vignesh", status: "Ready" }, { membername: "Vinoth", status: "Ready" }, { membername: "Majith", status: "Waiting" }];

    return <>

        <div className="conMem">
            {
                connectedmemebers.map((member, i) => {
                    return <Members membername={member.username} status={member.status} key={i}></Members>
                })
            }

            <div className="isInvite">
                <i class="fa-solid fa-plus plus"></i>
                <p style={{ fontSize: "larger", fontWeight: 900, color: "lightgray" }}>Invite Friends</p>
            </div>
        </div>

    </>
}

export default ConnectedMembers;