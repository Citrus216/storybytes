import React, { useState } from "react";
import axios from 'axios';
import { useStories } from "./DataContext";
import { useNavigate } from 'react-router-dom';
//import './HomePage.css'

type InputBoxProps = {
    onSubmit: (url: string) => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    age: string;
    poemMode: boolean;
};

export function InputBox({ onSubmit, setLoading, age, poemMode}: InputBoxProps) {
    const [queryText, setQuery] = useState('');
    const { addStory } = useStories();
    const navigate = useNavigate();

    const constructEndpoint = (queryText: string, age: string, poemMode: boolean) => {
        const encodedQuery = encodeURIComponent(queryText);
        let url = `http://localhost:8080/api/v1/story?q=${encodedQuery}`;
        if (age != "") {
            url += `&level=${encodeURIComponent(age)}`;
        }
        if (poemMode == true) {
            url += `&poemMode=true`;
        }

        axios.get(url)
            .then(response => {
                console.log('Search results:', response.data);
                const storyData = response.data.story;
                const formattedStory = {
                    name: response.data.cover.title,
                    images: [response.data.cover.image, ...storyData.map((page: any) => page.image)],
                    pages: storyData.map((page: any) => page.text),
                    audios: [response.data.cover.audio, ...storyData.map((page: any) => page.audio)]
                };

                addStory(formattedStory);
                navigate(`/story/${formattedStory.name}`);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            })
            .finally(() => {
                setLoading(false);
            });
        onSubmit(url);
    };

    const performSearch = () => {
        constructEndpoint(queryText, age, poemMode);
        setLoading(true)
    };

    return (
        <div className="container">
            <input
                type="text"
                className="input-box"
                placeholder="Enter story prompt..."
                value={queryText}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={performSearch} className="button" >Search</button>
        </div>
    );
}