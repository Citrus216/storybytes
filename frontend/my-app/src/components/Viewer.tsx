import React, { useState, useEffect } from 'react';
import { Story } from './DataContext';
import './Viewer.css';

interface StoryDisplayProps {
 story: Story;
}

const Viewer: React.FC<StoryDisplayProps> = ({ story }) => {
 const [currentPage, setCurrentPage] = useState(0);
 const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

 console.log(audio)

 useEffect(() => {
   // Load new audio file when currentPage changes
   if (story.audios && story.audios[currentPage]) {
    const newAudio = new Audio(`http://localhost:8080/files/${story.audios[currentPage]}`);
    newAudio.onloadeddata = () => {
      setAudio(newAudio);
    };
   }
 }, [currentPage, story.audios]);

 const handlePlayAudio = () => {
  if (audio) {
    audio.play();
  }
};

const handleNext = () => {
  if (currentPage < story.images.length - 1) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePrevious = () => {
  if (currentPage > 0) {
    setCurrentPage(currentPage - 1);
  }
};

return (
  <div className="story-container">
    {currentPage === 0 ? (
      // First page: display the first image alone
      <div>
        <img
          src={story.images[0]}
          alt={`Page ${currentPage + 1}`}
          className="full-width-image"
        />
      </div>
    ) : (
      // Subsequent pages: display image and text side-by-side
      <div className="story-page">
        <img
          src={story.images[currentPage]}
          alt={`Page ${currentPage + 1}`}
          className="story-image"
        />
        <p className="story-text">{story.pages[currentPage - 1]}</p>
      </div>
    )}

      <button onClick={handlePlayAudio} className="audio-button">
        Play Audio
      </button>

    {/* Navigation buttons */}
    <div className="navigation-buttons">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 0}
        className="navigation-button"
      >
        Previous
      </button>
      <button
        onClick={handleNext}
        disabled={currentPage === story.images.length - 1}
        className="navigation-button"
      >
        Next
      </button>
    </div>
  </div>
 ); 
};

export default Viewer;