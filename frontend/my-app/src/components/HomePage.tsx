import React, {useState} from "react";

import {InputBox} from './InputBox';
import {LoadingOverlay} from './LoadingOverlay';
import {AgeDrop} from './AgeDrop';
import {Menu} from './Menu';
import {NameLogo} from './NameLogo';
import './HomePage.css'



const HomePage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSearchSubmit = (url: string) => {
        console.log("URL received from InputBox:", url);
    };
    return (
        <div className={`home-container ${isLoading ? 'disabled' : ''}`}>
            <h1>StoryBytes</h1>
            <InputBox onSubmit={handleSearchSubmit} setLoading={setIsLoading}/>

            {isLoading && (
                <LoadingOverlay/>
            )}
        </div>
  )
};

export default HomePage;






