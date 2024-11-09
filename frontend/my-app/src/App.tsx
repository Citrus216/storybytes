import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { useStories } from './components/DataContext';
import Homepage from './components/HomePage';
import StoryPage from './components/StoryPage';

const App: React.FC = () => {
  const { stories } = useStories();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {stories.map((story) => (
          <Route key={story.name} path={`/story/${story.name}`} element={<StoryPage story={story} />} />
        ))}
      </Routes>
    </Router>
  );
};

export default App;