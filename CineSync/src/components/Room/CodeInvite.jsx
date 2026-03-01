import { useRef } from "react"
import Button from "../Login-SignIn/Button";
import toast from "react-hot-toast";
export default function InviteCode({code}){
    let codeInput = useRef(null);

    const toastSuccessStyle = {
        style: {
          borderRadius: "1rem",
          background: "#16A34A",
          color: "white",
          fontWeight: 600
        },
        iconTheme: {
          primary: "white",
          secondary: "#16A34A"
        }
      };
    function copy(){
        navigator.clipboard.writeText(code || "")
            .then(() => {
            console.log('Text copied to clipboard!');
            toast.success("Room ID Copied to Clipboard !!",toastSuccessStyle);
        })
        .catch((err) => {
           console.error('Failed to copy text: ', err);
        });
    }
    return(
        <>
           <h6>INVITE BY ROOM ID</h6>
            <div className="code">
            <div className="inputs flex" style={{ width: "100%" }}>
                    <input type="text" ref={codeInput} readOnly value={code || ""} style={{ width: "100%" }} />
                </div>
                <Button id={'copy'} icon={<i class="fa-solid fa-copy"></i>} onClick={copy}> Copy Room ID</Button>
                <p>Share this Room ID and password with friends.</p>
            </div>
        </>
    )
}