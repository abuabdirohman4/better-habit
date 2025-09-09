"use client";

import { useState } from "react";

interface FloatingAddButtonProps {
    className?: string;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
    className = "",
}) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = () => {
        console.log("Add habit button clicked");
        // TODO: Implement navigation to add habit page
    };

    const handleMouseDown = () => {
        setIsPressed(true);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    const handleMouseLeave = () => {
        setIsPressed(false);
    };

    return (
        <button
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className={`fixed bottom-6 right-6 w-14 h-14 bg-habit-blue hover:bg-habit-blue/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 ${
                isPressed ? "scale-95" : "scale-100"
            } ${className}`}
            aria-label="Add new habit"
        >
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                />
            </svg>
        </button>
    );
};

export default FloatingAddButton;
