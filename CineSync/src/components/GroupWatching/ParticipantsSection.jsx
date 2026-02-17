export default function ParticipantsSection() {
    return (
      <div className="participants">
        <div className="participants-header">
          ROOM PARTICIPANTS
        </div>
  
        <div className="participant">
          <div className="avatar"></div>
          <div>
            <div className="name">Alex Rivera (You)</div>
            <div className="status online">Camera On</div>
          </div>
        </div>
  
        <div className="participant">
          <div className="avatar"></div>
          <div>
            <div className="name">Movie Enthusiast</div>
            <div className="status online">Watching • Live</div>
          </div>
        </div>
  
        <div className="participant">
          <div className="avatar"></div>
          <div>
            <div className="name">Film Buff</div>
            <div className="status away">Away</div>
          </div>
        </div>
      </div>
    );
  }
  