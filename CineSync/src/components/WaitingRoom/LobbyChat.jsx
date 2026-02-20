
export default function LobbyChat() {
    return (
        <>
            <div className="lobbyChat">
                <div>
                    <p className="lobbbyPTag"><i class="fa-solid fa-comments lobbyItag"></i> LOBBY CHAT</p>

                </div>
                <div>
                    <div id="lobbyChatBox"></div>
                    <div className="chatInputContainer">
                        <input type="text"placeholder="Message the group..."className="chatInput"/>
                        <button className="sendBtn">➤</button>

                    </div>
                </div>
            </div>
        </>
    )
}