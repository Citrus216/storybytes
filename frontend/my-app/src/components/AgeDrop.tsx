import React, {useState} from "react";

    type AgeDropProps = {
        onSubmit: (age: string) => void;
    };

    export function AgeDrop({ onSubmit}: AgeDropProps) {
        const [selectedAge, setSelectedAge] = useState<string>("");
        
        const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedValue = e.target.value;
            setSelectedAge(selectedValue);
            onSubmit(selectedValue);
        };

    return (
        <div className="age-dropdown-container">
            <select 
                id="age"
                value={selectedAge}
                onChange={handleAgeChange}
                className="age-dropdown"
            >
                <option value="">Select Reading Level...</option>
                <option value="pre-k">Pre-K</option>
                <option value="kindergarten">Kindergarten</option>
                <option value="first">1st Grade</option>
                <option value="second">2nd Grade</option>
                <option value="third">3rd Grade</option>
                <option value="fourth">4th Grade</option>
                <option value="fifth">5th Grade</option>
                <option value="sixth-through-eighth">6th-8th Grade</option>
                <option value="ninth-through-twelfth">9th-12th Grade</option>
            </select>
        </div>
    );
}