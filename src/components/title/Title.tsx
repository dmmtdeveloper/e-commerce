import React from "react";
interface TitleProps {
  text: string;
  className: string;
}

export const Title: React.FC<TitleProps> = ({ text, className }) => {
  return <h1 className={`text-3xl font-normal, ${className}`}>{text}</h1>;
};
