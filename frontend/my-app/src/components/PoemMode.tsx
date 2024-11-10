import React from "react";

type PoemModeProps = {
    onToggle: (mode: boolean) => void;
};

export function PoemMode({ onToggle }: PoemModeProps) {
    const handlePoemModeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        onToggle(e.target.checked); 
    };

    return (
        <div className="poem-mode-toggle">
        <label htmlFor="poemMode">Poem Mode:</label>
        <input 
            type="checkbox" 
            id="poemMode" 
            onChange={handlePoemModeToggle}
            className="toggle-checkbox" 
        />
</div>
    );
}