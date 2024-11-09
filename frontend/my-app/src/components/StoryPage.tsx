import React from 'react';
import { Story } from '../components/DataContext';

interface StoryPageProps {
  story: Story;
}

const StoryPage: React.FC<StoryPageProps> = ({ story }) => {
  return <h1>Story</h1>;
};

export default StoryPage;