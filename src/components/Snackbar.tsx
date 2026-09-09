import { useEffect, useRef, useState } from "react";
import success from "../assets/success.svg";
import warning from "../assets/warning.svg";
import error from "../assets/error.svg";
import info from "../assets/info.svg";
import ProgressBar from "./ProgressBar";

export enum SnackbarSeverity {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info"
}

export interface SnackbarProps {
    onTimeout: () => void;
    message: string;
    severity: SnackbarSeverity;
    onClick: () => void;
}

export const SnackbarContainer = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex flex-col gap-3.5 absolute bottom-4 z-50 right-4">
            {children}
        </div>
    )
}

export const Snackbar = (props: SnackbarProps) => {
    let duration = 10000;
    const hasClicked = useRef(false);
    const intervalMs = 250;

    useEffect(() => {
        const spawnTime = Date.now();

        const intervalId = setInterval(() => {
            if (hasClicked.current) return;

            const now = Date.now();
            const actualElapsedTime = now - spawnTime;

            if (actualElapsedTime >= duration) {
                clearInterval(intervalId);
                props.onTimeout();
            }
        }, intervalMs);

        return () => clearInterval(intervalId);
    }, [props.onTimeout]);

    const handleSnackbarClick = () => {
        hasClicked.current = true; // Block the timer from firing
        props.onClick();
    };

    let bgColor = "";
    let bgColorHover = "";
    let progressBarClass = "";
    let icon = "";

    switch (props.severity) {
        case SnackbarSeverity.SUCCESS:
            bgColor = "bg-green-900";
            bgColorHover = "hover:bg-green-950";
            progressBarClass = "success-progress";
            icon = success;
            break;
        case SnackbarSeverity.ERROR:
            bgColor = "bg-red-900";
            bgColorHover = "hover:bg-red-950";
            progressBarClass = "error-progress";
            icon = error;
            break;
        case SnackbarSeverity.WARNING: 
            bgColor = "bg-yellow-900";
            bgColorHover = "hover:bg-yellow-950";
            progressBarClass = "warning-progress";
            icon = warning;
            break;
        case SnackbarSeverity.INFO:
            bgColor = "bg-blue-900";
            bgColorHover = "hover:bg-blue-950";
            progressBarClass = "info-progress";
            icon = info;
            break;
    }

    return (
    <button className={`flex flex-col items-stretch w-full text-white rounded ${bgColor} ${bgColorHover}`} onClick={handleSnackbarClick}>
        <div className="flex flex-row items-center text-white py-2 px-4">
            <img src={icon} alt="Info" className="w-5 h-5 mr-2" />
            <p className="max-w-xs truncate">{props.message}</p>
        </div>
        <ProgressBar duration={duration} className={progressBarClass} />
    </button>
    );
}