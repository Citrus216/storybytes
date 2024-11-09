import React, {useState} from "react";

import {InputBox} from './InputBox';
import {AgeDrop} from './AgeDrop';
import {Menu} from './Menu';
import {NameLogo} from './NameLogo';

const HomePage: React.FC = () => {
    const handleSearchSubmit = (url: string) => {
        console.log("URL received from InputBox:", url);
    };
    return (
        <div>
            <h1>HOME</h1>
            <InputBox onSubmit={handleSearchSubmit} />
        </div>
  )
};

export default HomePage;






