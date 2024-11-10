import React, { useEffect, useState } from 'react';
import { Story } from '../components/DataContext';
import Viewer from './Viewer';
import './StoryPage.css';


interface StoryPageProps {
story: Story;
}


const StoryPage: React.FC<StoryPageProps> = ({ story }) => {
   const [fadeIn, setFadeIn] = useState(false);


   useEffect(() => {
       setFadeIn(false); // Reset fade-in class
       const timeout = setTimeout(() => setFadeIn(true), 500); // Re-enable fade-in with a slight delay


       return () => clearTimeout(timeout); // Cleanup timeout on unmount
   }, [story]);


   return (
       <div className={`story-container ${fadeIn ? 'fade-in' : ''}`}>
         <h1 className="story-title">{story.name}</h1>
         <div className="view">
           <Viewer story={story} />
         </div>
       </div>
   );
};

export default StoryPage;
