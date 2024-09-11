import exp from "constants";
import React from "react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Valor de búsqueda:", event.target.value);
        onChange(event.target.value);
    };
    return (
        <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Buscar productos..."
        style={{ color: 'black', fontSize: '16px' }} 
      />
    );
}