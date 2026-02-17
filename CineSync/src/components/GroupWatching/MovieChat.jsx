import ChatSection from "./ChatSection";

export default function MovieChat({chatOpen,setOpen}) {
  return (
    <div className="right-panel" style={{ display: chatOpen ? "none" : "flex" }}>
      <ChatSection setOpen={setOpen}/>
    </div>
  );
}
