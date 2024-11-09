import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

export interface Story {
  name: string;
  images: string[]; //URLs or paths
  pages: string[];
  audios: string[];
}

interface StoriesState {
  stories: Story[];
}

type StoriesAction =
  | { type: 'ADD_STORY'; story: Story }
  | { type: 'REMOVE_STORY'; name: string }
  | { type: 'SET_STORIES'; stories: Story[] };

const StoriesContext = createContext<{
  stories: Story[];
  addStory: (story: Story) => void;
  removeStory: (name: string) => void;
  setStories: (stories: Story[]) => void;
} | undefined>(undefined);

const storiesReducer = (state: StoriesState, action: StoriesAction): StoriesState => {
  switch (action.type) {
    case 'ADD_STORY':
      return { ...state, stories: [...state.stories, action.story] };
    case 'REMOVE_STORY':
      return { ...state, stories: state.stories.filter(story => story.name !== action.name) };
    case 'SET_STORIES':
      return { ...state, stories: action.stories };
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
};

const StoriesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(storiesReducer, { stories: [] });

  // Load stories from session storage when the app starts
  useEffect(() => {
    const storedStories = sessionStorage.getItem('stories');
    if (storedStories) {
      dispatch({ type: 'SET_STORIES', stories: JSON.parse(storedStories) });
    }
  }, []);

  // Save stories to session storage whenever they change
  useEffect(() => {
    sessionStorage.setItem('stories', JSON.stringify(state.stories));
  }, [state.stories]);

  const addStory = (story: Story) => {
    dispatch({ type: 'ADD_STORY', story });
  };

  const removeStory = (name: string) => {
    dispatch({ type: 'REMOVE_STORY',name});
  };

  const setStories = (stories: Story[]) => {
    dispatch({ type: 'SET_STORIES', stories });
  };

  return (
    <StoriesContext.Provider value={{ stories: state.stories, addStory, removeStory, setStories }}>
      {children}
    </StoriesContext.Provider>
  );
};

const useStories = () => {
  const context = useContext(StoriesContext);
  console.log("StoriesContext:", context);
  if (!context) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
};

export { StoriesProvider, useStories };
