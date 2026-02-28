import Button from "../Login-SignIn/Button";
import def from "../../assets/onnapak.png";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Friend({ arr, handleFriend }) {

    const [invited, setInvited] = useState(false);

    function handleFrien(userName) {

        if (invited) {
            toast.success(userName + " is already Invited !!");
            return;
        }

        setInvited(true);
        toast.success(userName + " is Invited !!");
        handleFriend(userName);
    }

    return (
        <div className="friend">
            <div className="aboutFriend">
                <img src={def} alt="" />
                <div className="nameOfFriend">
                    <h3>{arr.username}</h3>
                </div>
            </div>

            <Button
                id="invite"
                disabled={invited}
                onClick={() => handleFrien(arr.username)}
            >
                {invited ? "Invited" : "Invite"}
            </Button>
        </div>
    );
}