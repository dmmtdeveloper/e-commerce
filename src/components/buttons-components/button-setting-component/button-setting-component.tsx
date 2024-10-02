import React from "react";

interface ButtonSetting {
  onClick: () => void;
  text: string;
  className?: string;
}

const ButtonSettingComponent: React.FC<ButtonSetting> = ({
  onClick,
  text,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-blue-500 hover:bg-blue-600 text-gray-100 text-sm py-2  rounded-lg px-4 ${className}`}
    >
      {text}
    </button>
  );
};

export default ButtonSettingComponent;
