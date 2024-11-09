import React from 'react';
import { Story } from '../components/DataContext';
import Viewer from './Viewer';

// interface StoryPageProps {
//  story: Story;
// }

// const StoryPage: React.FC<StoryPageProps> = ({ story }) => {
//     return (
//         <div>
//           <h1>{story.name}</h1>
//           <Viewer story={story} />
//         </div>
//     );
// };
const StoryPage: React.FC = () => {
    // Dummy data for testing
    const dummyStory: Story = {
      name: 'My Test Story',
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
  
    return (
      <div>
        <h1>{dummyStory.name}</h1>
        <Viewer story={dummyStory} />
      </div>
    );
  };

export default StoryPage;