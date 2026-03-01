import { useEffect, useState } from "react";
import Genre from "./Genre";
import { socket } from "../Home/socket";
import Loading from "../Home/Loading";
import { useNavigate } from "react-router-dom";
import './group.css';

export default function AISummarizer() {

    const [isdisplay, setdisplaysummary] = useState(false);
    const [summaryData, setSummaryData] = useState(null);
    const navigate = useNavigate();

    const continueToRoom = () => {
        localStorage.setItem("pendingResumeFromHost", "true");
        navigate("/mainRoom");
    };

    useEffect(() => {
        const handleSummary = (result) => {
            // console.log("Raw Summary:", result);

            let parsedData;

            if (typeof result.response === "string") {
                parsedData = JSON.parse(result.response);
            } else {
                parsedData = result;
            }

            // console.log("Parsed Summary:", parsedData);

            setSummaryData(parsedData);
            setdisplaysummary(true);
        };

        socket.on("summaryFromHost", handleSummary);

        return () => {
            socket.off("summaryFromHost", handleSummary);
        };
    }, []);
    if (!summaryData) {

        return (
            <div className="parent-summary">

                <Loading style={isdisplay ? { display: "none" } : { display: "block" }} />

            </div>
        );
    }
    else {
        return (
            <div className="parent-summary">
            <div
                className="main-summary"
                style={isdisplay ? { display: "flex" } : { display: "none" }}
            >
                <div className="summary-imageholder">
                    <img
                        className="summary-movie-image"
                        src={localStorage.getItem("MovieImage")}
                        alt="movie"
                    />
                </div>

                <div className="movie-details">

                    <h3 className="movieName">
                        {summaryData?.movie_title}
                        {summaryData?.release_year &&
                            <span> ({summaryData.release_year})</span>}
                    </h3>

                    <div style={{ display: "flex", gap: "1rem" }} className="movie-top">
                        {summaryData?.genre?.map((g, i) => (
                            <Genre genre={g} key={i} />
                        ))}
                    </div>

                    <div className="tone-icon">
                        <p className="summary-tone">
                            <i className="fa-regular fa-face-smile" id="icon"></i>
                            <span> Tone: {summaryData?.tone}</span>
                        </p>

                        <p className="summary-tone" style={{ marginLeft: "1px" }}>
                            <i className="fa-solid fa-location-dot" id="icon"></i>
                            <span> Setting: {summaryData?.setting}</span>
                        </p>
                    </div>

                    <hr />

                    <div className="plot-summary-main">
                        <div className="plot-summary-first">
                            <i className="fa-solid fa-clipboard-list" id="icon"></i>
                            <span> Plot Summary</span>
                        </div>
                        <div>
                            <p className="plot-summary">
                                {summaryData?.plot_summary}
                            </p>
                        </div>
                    </div>

                    <div className="plot-summary-main">
                        <div className="plot-summary-first">
                            <i className="fa-solid fa-down-left-and-up-right-to-center" id="icon"></i>
                            <span> Main Conflict</span>
                        </div>
                        <div>
                            <p className="plot-summary">
                                {summaryData?.main_conflict}
                            </p>
                        </div>
                    </div>

                    <div className="plot-summary-main">
                        <div className="plot-summary-first">
                            <i className="fa-solid fa-clipboard-check" id="icon"></i>
                            <span> Resolution</span>
                        </div>
                        <div>
                            <p className="plot-summary">
                                {summaryData?.resolution}
                            </p>
                        </div>
                    </div>
                    <div className="summary-actions">
                        <button className="continue-watch-btn" onClick={continueToRoom}>
                            Continue
                        </button>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}