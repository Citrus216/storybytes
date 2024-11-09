import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Story, useStories } from './components/DataContext';
import Homepage from './components/HomePage';
import StoryPage from './components/StoryPage';
import { Menu } from './components/Menu';

const App: React.FC = () => {
  const { stories } = useStories();

  console.log(stories);

  return (
    <Router>
      <Menu/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {stories.map((story) => (
          <Route
            key={story.name}
            path={`/story/${story.name}`}
            element={<StoryPage story={story} />}
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;