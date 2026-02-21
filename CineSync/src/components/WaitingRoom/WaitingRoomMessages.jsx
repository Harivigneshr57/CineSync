export default function WaitingRoomMessages(props) {

    const role = props.role;
    const text = props.message;

    if (role == localStorage.getItem("Username")) {

        return (
            <div className="waiting-chat-row">
                <p>You</p>
                <div className="chat-our-message">
                    <p>{text}</p>
                </div>
            </div>
        );

    } else {

        return (
            <div id="waiting-chat-row1">
                <p>{role}</p>
                <div className="chat-our-message2">
                    <p>{text}</p>
                </div>
            </div>
        );

    }

}