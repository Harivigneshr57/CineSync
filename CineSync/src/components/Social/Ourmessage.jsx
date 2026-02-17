function Ourmessage(props) {
    if(props.role == "our"){
        return <>
        <div className="chat-row">
            <div className="chat-our-message">
                <p>{props.message}</p>
            </div>
        </div>
    </>
    }
    else{
        return <>
        <div className="chat-row1">
            <div className="chat-our-message2">
                <p>{props.message}</p>
            </div>
        </div>
    </>
    }
}

export default Ourmessage;