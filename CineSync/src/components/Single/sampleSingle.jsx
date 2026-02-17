import { useState } from "react";
export default function SampleSingle() {
    const [fileId, setFileId] = useState("");
    const [videoURL,setvideoURL]=useState("");
    let mid="";
    async function fetMovie() {
        console.log("Hi");
        try {
            const res = await fetch("/server/movies/getAllMovies");
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
                    <source src="https://movies-video-development.zohostratus.in/parandhupo_1.mp4?versionId=01kh8h1x4zzp3fqtktncyb9rc0" type="video/mp4" />
                </video>
        </div>
    );
}