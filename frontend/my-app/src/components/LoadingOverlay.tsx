import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";

import './HomePage.css'

import loadingGif from "./loading-book.gif";
import loadingMessagesData from "./loading-messages.json";


const getRandomLoadingMessage = (): string => {
    const loadingMessages = loadingMessagesData.loadingMessages;
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    return loadingMessages[randomIndex];
  };

export function LoadingOverlay () {
    const [loadingMessage, setLoadingMessage] = useState(getRandomLoadingMessage());
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const messageInterval = setInterval(() => {
          setIsFading(true);
    
          setTimeout(() => {
            setLoadingMessage(getRandomLoadingMessage());
            setIsFading(false);
          }, 1000);
    
        }, 3000);
    
        return () => clearInterval(messageInterval);
      }, []);

  

  return ReactDOM.createPortal(
    <div className="loading-overlay">
      <img
        src={loadingGif}
        alt="Loading"
        className="loading-image"
        draggable="false"
      />
      <div className={`loading-message ${isFading ? 'fade-out' : 'fade-in'}`}>{loadingMessage}</div>
    </div>,
    document.body
  );
};