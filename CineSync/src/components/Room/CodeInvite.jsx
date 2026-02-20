import { useRef } from "react"
import Button from "../Login-SignIn/Button";
import toast from "react-hot-toast";
export default function InviteCode({code}){
    let inputOne = useRef(null);
    let inputTwo = useRef(null);
    let inputThree = useRef(null);
    let inputFour = useRef(null);
    console.log("===================");
    let temp=code;
    let digit=[];
    while(temp>0){
        digit.push(temp%10);
        temp=Math.floor(temp/10);
    }
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
        navigator.clipboard.writeText(inputOne.current.value+inputTwo.current.value+inputThree.current.value+inputFour.current.value)
            .then(() => {
            console.log('Text copied to clipboard!');
            toast.success("Code Copied to Clipboard !!",toastSuccessStyle);
        })
        .catch((err) => {
           console.error('Failed to copy text: ', err);
        });
    }
    return(
        <>
            <h6>INVITE BY CODE</h6>
            <div className="code">
                <div className="inputs flex">
                    <input type="number" max={1} ref={inputOne} readOnly value={digit[3]} />
                    <input type="number" max={1} ref={inputTwo} readOnly value={digit[2]}/>
                    <input type="number" max={1} ref={inputThree} readOnly value={digit[1]}/>
                    <input type="number" max={1} ref={inputFour} readOnly value={digit[0]}/>
                </div>
                <Button id={'copy'} icon={<i class="fa-solid fa-copy"></i>} onClick={copy}> Copy Code</Button>
                <p>Share this Four Digit Code with Friends.</p>
            </div>
        </>
    )
}