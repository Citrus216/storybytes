import React, { useState } from 'react';
import { useStories } from './DataContext';
import { Link, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './Menu.css'


export function Menu() {
   const [isOpen, setIsOpen] = useState(false);
   const { stories, setStories, removeStory } = useStories();
   const navigate = useNavigate();


   const toggleMenu = () => setIsOpen(!isOpen);


   const handleNavigate = (path: string) => {
       navigate(path);
       setIsOpen(false);
   };


   const onDragEnd = (result: any) => {
     if (!result.destination) return;


     const reorderedStories = Array.from(stories);
     const [movedStory] = reorderedStories.splice(result.source.index, 1);
     reorderedStories.splice(result.destination.index, 0, movedStory);


     setStories(reorderedStories);
   };


   return (
       <>
           <button className="menu-icon" onClick={toggleMenu}>
              <i className="fas fa-bars"></i>
           </button>
             <div className={`menu ${isOpen ? 'open' : 'closed'}`}>
                 <div className="menu-header">
                     <h2>Menu</h2>
                     <button className="close-menu" onClick={toggleMenu}>
                       <i className="fas fa-angle-left"></i>
                     </button>
                 </div>
                 <ul>
                     <li className="menu-link" onClick={() => handleNavigate('/')}>Home</li>
                 </ul>
                 <DragDropContext onDragEnd={onDragEnd}>
                     <Droppable droppableId="stories">
                         {(provided) => (
                             <ul
                                 ref={provided.innerRef}
                                 {...provided.droppableProps}
                                 className="story-list"
                             >
                                 {stories.map((story, index) => (
                                     <Draggable key={story.name} draggableId={story.name} index={index}>
                                         {(provided) => (
                                             <li
                                                 ref={provided.innerRef}
                                                 {...provided.draggableProps}
                                                 {...provided.dragHandleProps}
                                                 onClick={() => handleNavigate(`/story/${story.name}`)}
                                                 className="story-item menu-link"
                                             >
                                                 {story.name}
                                                 <span
                                                    className="delete-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevents triggering navigation
                                                        removeStory(story.name); // Calls remove function
                                                    }}
                                                    >
                                                    &times;
                                                </span>
                                             </li>
                                         )}
                                     </Draggable>
                                 ))}
                                 {provided.placeholder}
                             </ul>
                         )}
                     </Droppable>
                 </DragDropContext>
             </div>
       </>
   );
}
