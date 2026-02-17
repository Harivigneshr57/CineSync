import Button from "../Login-SignIn/Button";
export default function TopBar() {
    return (
      <div className="topbar">
        <div className="left flex">
          <h2>Movie Name</h2>
          <span className="live-badge">LIVE</span>
        </div>
        <div className="headbuttons flex">
            <Button><i class="fa-solid fa-gear"></i></Button>
            <Button id={'inviteRoom'}>Invite  <i class="fa-solid fa-user-plus"></i></Button>
        </div>
      </div>
    );
  }
  