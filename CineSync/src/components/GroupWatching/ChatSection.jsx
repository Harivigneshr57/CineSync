import ParticipantsSection from "./ParticipantsSection";
export default function ChatSection() {
    return (
      <div className="room-chat">
        <div className="chat-header">
          <span>Live Chat</span>
          <span className="online">4 Online</span>
        </div>
  
        <div className="chat-messages">
          <div className="message">
            <div className="avatar"></div>
            <div className="bubble">
              The cinematography in this scene is absolutely breathtaking!
            </div>
          </div>
  
          <div className="message me">
            <div className="bubble">
              Wes Anderson's symmetry is unmatched.
            </div>
          </div>
        </div>
        <ParticipantsSection />
        <div className="chat-input">
          <input placeholder="Type a message..." />
          <button>➤</button>
        </div>
      </div>
    );
  }
  