import React, { useState, useEffect } from 'react';
import { Story } from './DataContext';
import './Viewer.css';
import { CSSTransition, SwitchTransition } from 'react-transition-group';


interface StoryDisplayProps {
story: Story;
}
interface Definition {
word: string;
audio?: string;
definitions: { partOfSpeech: string; definition: string }[];
}
const colors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];


const Viewer: React.FC<StoryDisplayProps> = ({ story }) => {
const [currentPage, setCurrentPage] = useState(0);
const [currentAudio, setCurrentAudio] = useState(0);
const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
const [definition, setDefinition] = useState<Definition | null>(null);
const [showDefinition, setShowDefinition] = useState(false);
const [backgroundColor, setBackgroundColor] = useState('');
const [borderColor, setBorderColor] = useState('');
const [buttonColor, setButtonColor] = useState('');


useEffect(() => {
 const shuffledColors = [...colors].sort(() => 0.5 - Math.random());


 const [randomColor, randomColor2, randomColor3] = shuffledColors;


 setBackgroundColor(randomColor);
 setBorderColor(`${randomColor2}bor`);
 setButtonColor(`${randomColor3}but`);
}, []);


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
           <div className={`cover-housing ${backgroundColor} ${borderColor}`}>
             <img
               src={`http://localhost:8080/files/${story.images[0]}`}
               alt={`Cover Page`}
               className={`full-width-image ${borderColor}`}
               draggable={false}
             />
           </div>
           <div className="navigation-buttons">
             <button
               onClick={handlePrevious}
               disabled={currentPage === 0}
               className={`prev-button ${buttonColor}`}>
               <i className="fas fa-angle-left" style={{ color: '#595959' }}></i>
             </button>
             <button
               onClick={handleNext}
               disabled={currentPage === story.images.length - 1}
               className={`next-button ${buttonColor}`}>
               <i className="fas fa-angle-right" style={{ color: '#595959' }}></i>
             </button>
           </div>
           <button onClick={handlePlayAudio} className="audio-button">
             <i className="fas fa-volume-up" style={{ color: '#595959' }}></i>
           </button>
         </div>
       ) : (
         // Subsequent pages: display image and text side-by-side
         <div className="story-page">
           <div className={`img-text-housing ${backgroundColor} ${borderColor}`}>
             {/* <SwitchTransition mode="out-in">
             <CSSTransition
               key={currentPage}
               timeout={300}
               classNames="fade"
             > */}
             <img
               src={`http://localhost:8080/files/${story.images[currentPage]}`}
               alt={`Page ${currentPage + 1}`}
               className={`story-image ${borderColor}`}
               draggable={false}
             />
               {/* </CSSTransition>
             </SwitchTransition>
             <SwitchTransition mode="out-in">
             <CSSTransition
               key={currentPage}
               timeout={300}
               classNames="fade"
             > */}
             <p className={`story-text ${borderColor}`}>
               {tokenizeAndRenderText(story.pages[currentPage - 1])}
             </p>
               {/* </CSSTransition>
             </SwitchTransition> */}
           </div>
           <div className="navigation-buttons">
             <button
               onClick={handlePrevious}
               disabled={currentPage === 0}
               className={`prev-button ${buttonColor}`}>
               <i className="fas fa-angle-left" style={{ color: '#595959' }}></i>
             </button>
             <span className="page-counter">
               Page {currentPage} of {story.images.length - 1}
             </span>
             <button
               onClick={handleNext}
               disabled={currentPage === story.images.length - 1}
               className={`next-button ${buttonColor}`}>
               <i className="fas fa-angle-right" style={{ color: '#595959' }}></i>
             </button>
           </div>
           <button onClick={handlePlayAudio} className="audio-button">
             <i className="fas fa-volume-up" style={{ color: '#595959' }}></i>
           </button>
           {showDefinition && definition && (
             <div className="overlay" onClick={() => setShowDefinition(false)}>
               <div className={`definition-modal ${backgroundColor} ${borderColor}`} onClick={(e) => e.stopPropagation()}>
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
