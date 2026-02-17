function Chathead(props) {
    return <>
    <div className="chat-top-profile">
    <div className="chat-head">
            <div className="chat-profile-pic"><img className="chat-profile-img" src="https://imgs.search.brave.com/gKbcUbCmGDrhJxRAY6zFBx5mUvvlxhSycwM9-0UyG0k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzkzLzVj/L2JhLzkzNWNiYTdh/NDQ3MWIwNjJmMGJk/MjdkZjMwNmIxODIw/LmpwZw" alt="" /></div>
            <div className="chat-profile-detail">
                <h3 className="chat-friend-name">{props.currentUser}</h3>
                <p className="chat-friend-bio">Hi I am using Onna paarkalaam</p>
            </div>
        </div>
        <div className="chat-x-button">
                <button className="chat-xmark" onClick={()=>{props.hideChat()}}><i className="fa-solid fa-xmark"></i></button>
         </div>
    </div>
        </>
}

export default Chathead;