import { useRef, useState } from 'react'
import Button from '../Login-SignIn/Button';
export default function JoinRoom(){
    let inputOne = useRef(null);
    let inputTwo = useRef(null);
    let inputThree = useRef(null);
    let inputFour = useRef(null);
    let button = useRef(null);
    return (
        <>
        <div className="joinRoom flex">
            <div className="joinTime flex">
                <i className="fa-solid fa-key"></i>
            </div>
            <h1>Join a Room</h1>
            <p>Enter the 4-digit code to enter room</p>
            <div className="inputs flex">
                <input type="number" max={1} ref={inputOne} onChange={()=>inputTwo.current.focus()} />
                <input type="number" max={1} ref={inputTwo} onChange={()=>inputThree.current.focus()}/>
                <input type="number" max={1} ref={inputThree} onChange={()=>inputFour.current.focus()}/>
                <input type="number" max={1} ref={inputFour} onChange={()=>button.current.focus()}/>
            </div>
            <Button id={"joinRoom"} ref={button}>Join Room</Button>
        </div>
        </>
    )
}