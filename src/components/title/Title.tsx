import React from "react";
interface TitleProps {
  text: string;
}

export const Title: React.FC<TitleProps> = ({ text }) => {
  return <h1 className="text-3xl font-normal text-center">{text}</h1>;
};
