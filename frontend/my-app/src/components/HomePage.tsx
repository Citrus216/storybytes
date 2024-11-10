import React, {useState} from "react";

import {InputBox} from './InputBox';
import {LoadingOverlay} from './LoadingOverlay';
import {AgeDrop} from './AgeDrop';
import {PoemMode} from './PoemMode';
import './HomePage.css'


const HomePage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAge, setSelectedAge] = useState<string>("");
    const [poemMode, setPoemMode] = useState<boolean>(false);

    const handleSearchSubmit = (url: string) => {
        console.log("URL received from InputBox:", url);
    };

    const handleAgeSubmit = (age: string) => {
        setSelectedAge(age);
    };

    const handlePoemModeToggle = () => {
        setPoemMode(!poemMode);
    };

    return (
        <div className={`home-container ${isLoading ? 'disabled' : ''}`}>
            <h1>StoryBytes</h1>
            <InputBox onSubmit={handleSearchSubmit} setLoading={setIsLoading} age={selectedAge} poemMode={poemMode} />

            <div className="dropdown-and-poem-container">
                <AgeDrop onSubmit={handleAgeSubmit}/>
                <PoemMode onToggle={handlePoemModeToggle}/>
            </div>

            {isLoading && (
                <LoadingOverlay/>
            )}
        </div>
  )
};

export default HomePage;






