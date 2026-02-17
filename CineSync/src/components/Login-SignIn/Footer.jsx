export default function Footer(){
    return(
        <>
    <footer>
      <div className="footer-container flex1">
        <div className="footer-brand">
          <h2>Onna <span style={{color:"#4A6E8A"}}>Paarkalam</span></h2>
          <p>Watch together. Anywhere. Anytime.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <a href="#">Shared Rooms</a>
            <a href="#">Live Chat</a>
            <a href="#">Sync Playback</a>
          </div>
          <div>
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact</a>
            <a href="#">Report Issue</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Onna Paarkalam • Built for collaborative movie watching
      </div>
    </footer>
        </>
    )
}