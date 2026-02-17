import { useState } from "react";
export default function SampleSingle() {
    const [fileId, setFileId] = useState("");
    const [videoURL,setvideoURL]=useState("");
    let mid="";
    async function fetMovie() {
        console.log("Hi");
        try {
            const res = await fetch("https://cinesync-3k1z.onrender.com/getAllMovies");
            const data = await res.json();
            
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            <h2>Movie Player</h2>
            {/* <button onClick={fetMovie}>Click</button> */}
                <video controls width="600">
                    <source src="https://res.cloudinary.com/dsike2jgr/video/upload/v1771335888/Asuran_dosyjf.mp4" type="video/mp4" />
                </video>
        </div>
    );
}