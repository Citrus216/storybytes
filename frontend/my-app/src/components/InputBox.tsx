import React, {useState} from "react";
import axios from 'axios';

export function InputBox(onSubmit: any) {
    const [queryText, setQuery] = useState('');
    const constructEndpoint = (queryText: string) => {
        const encodedQuery = encodeURIComponent(queryText);
        const url = `http://localhost:3000/api/v1/story?q=${encodedQuery}`;

        axios.get(url)
            .then(response => {
              console.log('Search results:', response.data);
            })
            .catch(error => {
              console.error('Error fetching search results:', error);
            });
        onSubmit(url)
    };

    const performSearch = () => {
        constructEndpoint(queryText);
    }

    return (
        <div className="container">
            <input type="text" className="input-box" placeholder="Enter story prompt..." />
        </div>
    )

  };