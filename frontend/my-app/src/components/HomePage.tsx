import React, {useState} from "react";

import {InputBox} from './InputBox';
import {AgeDrop} from './AgeDrop';
import {Menu} from './Menu';
import {NameLogo} from './NameLogo';
import './HomePage.css'

const HomePage: React.FC = () => {
    const handleSearchSubmit = (url: string) => {
        console.log("URL received from InputBox:", url);
    };
    return (
        <div className="home-container">
            <h1>StoryBytes</h1>
            <InputBox onSubmit={handleSearchSubmit} />
        </div>
  )
};

export default HomePage;






