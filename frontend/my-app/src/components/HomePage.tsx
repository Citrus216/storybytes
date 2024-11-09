import React, {useState, useEffect} from "react";

import {InputBox} from './InputBox';
import {AgeDrop} from './AgeDrop';
import {Menu} from './Menu';
import {NameLogo} from './NameLogo';
import { useStories } from "./DataContext";
import { useNavigate } from 'react-router-dom';
import { Story } from './DataContext';

const HomePage: React.FC = () => {
const { stories, addStory } = useStories();
const navigate = useNavigate();

const dummyStory: Story = {
    name: 'test',
    images: [
      'https://via.placeholder.com/300', // Placeholder image URLs
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/300'
    ],
    pages: [
      'This is the first page of the story.',
      'This is the second page of the story.',
      'This is the third page of the story.'
    ],
    audios: []
  };

  const handleAddStory = () => {
    // Only add the story if it doesn't already exist
    if (!stories.some(story => story.name === dummyStory.name)) {
      addStory(dummyStory);
    }
    navigate(`/story/${dummyStory.name}`);
  };

  return (
    <div>
        <h1>Home</h1>;
        <button onClick={handleAddStory}>Add Dummy Story</button>
    </div>
  )
  
  
};

export default HomePage;






