export default function FloatingEmoji({ emoji }) {
    return (
      <div className="floating-div">
        {emoji.flatMap((ele) =>
        <>
        <h1 key={`${ele.id}`}className="floating-emoji">{ele.value}</h1>
        
        </>
        )}
      </div>
    );
  }