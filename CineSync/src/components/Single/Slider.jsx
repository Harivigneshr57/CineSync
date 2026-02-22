import React, { useState, useRef } from "react";

export default function Slider() {
    const [value, setValue] = useState(50);
    const sliderRef = useRef(null);
    const min = 0;
    const max = 100;

    // Update slider value based on mouse offset
    const updateValue = (offsetX) => {
        const width = sliderRef.current.offsetWidth;
        let newValue = (offsetX / width) * (max - min) + min;
        newValue = Math.min(Math.max(newValue, min), max); // clamp
        setValue(Math.round(newValue));
    };

    // Handle click & drag
    const handleMouseDown = (e) => {
        updateValue(e.nativeEvent.offsetX);

        const handleMove = (e) => {
            // e.nativeEvent.offsetX may not work during drag, calculate relative position
            const rect = sliderRef.current.getBoundingClientRect();
            const offset = e.clientX - rect.left;
            updateValue(offset);
        };

        const handleUp = () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
    };

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div style={{ width: "400px", padding: "20px" }}>
            <div ref={sliderRef} onMouseDown={handleMouseDown} style={{ position: "relative", height: "8px", background: "#ddd", borderRadius: "4px", cursor: "pointer" }}>
                {/* Filled Track */}
                <div style={{ position: "absolute", height: "100%", width: `${percentage}%`, background: "rgb(80,120,149)", borderRadius: "4px", }} />
                {/* Thumb */}
                <div style={{ position: "absolute", left: `${percentage}%`, top: "50%", transform: "translate(-50%, -50%)", width: "20px", height: "20px", borderRadius: "50%", background: "#4f46e5", }} />
            </div>
            <p>Value: {value}</p>
        </div>
    );
}
