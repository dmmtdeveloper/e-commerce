import React from "react";

interface ButtonSetting {
  onClick?: () => void;
  text: string;
  className?: string;
  type?: any 
}

const ButtonCtaComponent: React.FC<ButtonSetting> = ({
  onClick,
  text,
  className,
  type
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-500 hover:bg-blue-600 text-gray-100 text-sm py-2  rounded-lg px-4 ${className}`}
    >
      {text}
    </button>
  );
};

export default ButtonCtaComponent;
