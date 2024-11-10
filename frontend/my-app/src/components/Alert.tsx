import React, { useEffect, useState } from 'react';
import './Alert.css'; 

type AlertProps = {
    message: string;
    onClose: () => void;
};

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (fadeOut) {
            const closeTimer = setTimeout(() => {
                onClose();  
            }, 1000);
            return () => clearTimeout(closeTimer);
        }
    }, [fadeOut, onClose]);

    return (
        <div className={`alert ${fadeOut ? 'fade-out' : ''}`}>
            {message}
        </div>
    );
};

export default Alert;
