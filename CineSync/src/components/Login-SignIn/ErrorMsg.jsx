export default function Msg({ title, error, show, style }) {
  return (
    <div id={style?"Msg":"msg"} className={show ? "show" : ""}>
      <h1 id="title">{title}</h1>
      <p id="err">{error}</p>
    </div>
  );
}
  