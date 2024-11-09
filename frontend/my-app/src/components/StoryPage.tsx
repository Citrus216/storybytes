import React from 'react';
import { Story } from '../components/DataContext';
import Viewer from './Viewer';
import './StoryPage.css'

interface StoryPageProps {
 story: Story;
}

const StoryPage: React.FC<StoryPageProps> = ({ story }) => {
    return (
        <div className="story-container">
          <h1 className="story-title">{story.name}</h1>
          <Viewer story={story} />
        </div>
    );
};

export default StoryPage;