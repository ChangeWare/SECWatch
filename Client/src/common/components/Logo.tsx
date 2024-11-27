import React from "react";

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

export const Logo: React.FC<LogoProps> = ({
                                              className = '',
                                              width = 200,
                                              height = 60
                                          }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 60"
            width={width}
            height={height}
            className={className}
        >
            <circle cx="30" cy="25" r="15" fill="none" stroke="#8ecae6" strokeWidth="4"/>
            <line x1="40" y1="36" x2="55" y2="50" stroke="#8ecae6" strokeWidth="4" strokeLinecap="round"/>
            <path d="M25 25 Q30 20 35 25 Q30 30 25 25" fill="#fb8500"/>
            <text x="65" y="35" fontFamily="Arial" fontWeight="bold" fontSize="24" fill="#8ecae6">
                SEC<tspan fill="#ffb703">Watch</tspan>
            </text>
        </svg>
    );
};