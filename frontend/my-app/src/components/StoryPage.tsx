import React from 'react';
import { Story } from '../components/DataContext';
import Viewer from './Viewer';

interface StoryPageProps {
 story: Story;
}

const StoryPage: React.FC<StoryPageProps> = ({ story }) => {
    return (
        <div>
          <h1>{story.name}</h1>
          <Viewer story={story} />
        </div>
    );
};

export default StoryPage;