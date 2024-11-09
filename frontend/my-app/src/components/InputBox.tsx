import React, { useState } from "react";
import axios from 'axios';
import { useStories } from "./DataContext";
import { useNavigate } from 'react-router-dom';

type InputBoxProps = {
    onSubmit: (url: string) => void;
};

export function InputBox({ onSubmit }: InputBoxProps) {
    const [queryText, setQuery] = useState('');
    const { addStory } = useStories();
    const navigate = useNavigate();

    const constructEndpoint = (queryText: string) => {
        const encodedQuery = encodeURIComponent(queryText);
        const url = `http://localhost:8080/api/v1/story?q=${encodedQuery}`;

        axios.get(url)
            .then(response => {
                console.log('Search results:', response.data);
                const storyData = response.data.story;
                const formattedStory = {
                    name: response.data.cover.title,
                    images: [
                        response.data.cover.image, // Add the cover image first
                        ...storyData.map((page: any) => page.image) // Add other images
                    ],
                    pages: storyData.map((page: any) => page.text),
                    audios: []
                };

                addStory(formattedStory);
                navigate(`/story/${formattedStory.name}`);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
        onSubmit(url);
    };

    const performSearch = () => {
        constructEndpoint(queryText);
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
            <button onClick={performSearch}>Search</button>
        </div>
    );
}