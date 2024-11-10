import React, { useState, useEffect } from 'react';
import { Story } from './DataContext';
import './Viewer.css';


interface StoryDisplayProps {
story: Story;
}
interface Definition {
 word: string;
 audio?: string;
 definitions: { partOfSpeech: string; definition: string }[];
}

const Viewer: React.FC<StoryDisplayProps> = ({ story }) => {
const [currentPage, setCurrentPage] = useState(0);
const [currentAudio, setCurrentAudio] = useState(0);
const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
const [definition, setDefinition] = useState<Definition | null>(null);
const [showDefinition, setShowDefinition] = useState(false);

useEffect(() => {
  if (story.audios && story.audios[currentPage]) {
   const newAudio = new Audio(`http://localhost:8080/files/${story.audios[currentPage]}`);
   newAudio.onloadeddata = () => {
     setAudio(newAudio);
     setCurrentAudio(currentPage);
   };
  }
}, [currentPage, story.audios]);

useEffect(() => {
 return () => {
   if (audio) {
     audio.pause();
     audio.currentTime = 0;
   }
 };
}, [audio]);

const handlePlayAudio = () => {
 if (audio && currentPage == currentAudio) {
   if (audio.paused) {
     audio.play();
   } else {
     audio.pause();
   }
 }
};

const handleNext = () => {
 if (audio) {
   audio.pause();
 }
 if (currentPage < story.images.length - 1) {
   setCurrentPage(currentPage + 1);
 }
};

const handlePrevious = () => {
 if (audio) {
   audio.pause();
 }
 if (currentPage > 0) {
   setCurrentPage(currentPage - 1);
 }
};

const fetchDefinition = async (word: string) => {
 try {
   const response = await fetch(`http://localhost:8080/api/v1/dict?word=${word}`);
   if (response.ok) {
     const data = await response.json();
     console.log(data);
     setDefinition(data);
     setShowDefinition(true);
   }
 } catch (error) {
   console.error('Error fetching definition:', error);
 }
};

const handleWordClick = (word: string) => {
 fetchDefinition(word);
};

const tokenizeAndRenderText = (text: string) => {
 return text.split(' ').map((word, index) => (
   <React.Fragment key={index}>
     <span
       className="clickable-word"
       onClick={() => handleWordClick(word)}
       style={{ cursor: 'pointer' }}
     >
       {word}
     </span>
     {index < text.split(' ').length - 1 && ' '}
   </React.Fragment>
 ));
};

useEffect(() => {
 const handleKeyDown = (event: KeyboardEvent) => {
   if (event.key === 'ArrowRight') {
     handleNext();
   } else if (event.key === 'ArrowLeft') {
     handlePrevious();
   } else if (event.key === ' ') {
     event.preventDefault();
     handlePlayAudio();
   }
 };

 window.addEventListener('keydown', handleKeyDown);
 return () => {
   window.removeEventListener('keydown', handleKeyDown);
 };
}, [currentPage, audio, handleNext, handlePrevious, handlePlayAudio]);

return (
   <div className="story-div">
     {currentPage === 0 ? (
       // First page: display the first image as cover
       <div className="cover-page">
         <div className="cover-housing">
           <img
             src={`http://localhost:8080/files/${story.images[0]}`}
             alt={`Cover Page`}
             className="full-width-image"
           />
         </div>
         <div className="navigation-buttons">
           <button
             onClick={handlePrevious}
             disabled={currentPage === 0}
             className="prev-button">
             <i className="fas fa-angle-left"></i>
           </button>
           <button
             onClick={handleNext}
             disabled={currentPage === story.images.length - 1}
             className="next-button">
             <i className="fas fa-angle-right"></i>
           </button>
         </div>
         <button onClick={handlePlayAudio} className="audio-button">
           <i className="fas fa-volume-up"></i>
         </button>
       </div>
     ) : (
       // Subsequent pages: display image and text side-by-side
       <div className="story-page">
         <div className="img-text-housing">
           <img
             src={`http://localhost:8080/files/${story.images[currentPage]}`}
             alt={`Page ${currentPage + 1}`}
             className="story-image"
           />
           <p className="story-text">
             {tokenizeAndRenderText(story.pages[currentPage - 1])}
           </p>
         </div>
         <div className="navigation-buttons">
           <button
             onClick={handlePrevious}
             disabled={currentPage === 0}
             className="prev-button">
             <i className="fas fa-angle-left"></i>
           </button>
           <span className="page-counter">
             Page {currentPage} of {story.images.length - 1}
           </span>
           <button
             onClick={handleNext}
             disabled={currentPage === story.images.length - 1}
             className="next-button">
             <i className="fas fa-angle-right"></i>
           </button>
         </div>
         <button onClick={handlePlayAudio} className="audio-button">
           <i className="fas fa-volume-up"></i>
         </button>
         {showDefinition && definition && (
           <div className="overlay" onClick={() => setShowDefinition(false)}>
             <div className="definition-modal" onClick={(e) => e.stopPropagation()}>
               <button className="close-button" onClick={() => setShowDefinition(false)}>
                 &times;
               </button>
               <h2>{definition.word}</h2>
               {definition.definitions.map((def, index) => (
                 <div key={index} className="definition-item">
                   <strong>{def.partOfSpeech}:</strong> {def.definition}
                 </div>
               ))}
             </div>
           </div>
         )}
       </div>
     )}
   </div>
 );
};

export default Viewer;
