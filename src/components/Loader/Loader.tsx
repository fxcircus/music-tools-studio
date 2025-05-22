import React, { FC } from "react";
import './Loader.css';

interface LoaderProps {
    text?: string;
}

const Loader: FC<LoaderProps> = ({ text }) => {
    return (
        <div className="loader">
            <div className="arc"></div>
            {text && <div className="loader-text">{text}</div>}
        </div>
    );
};

export default Loader;



