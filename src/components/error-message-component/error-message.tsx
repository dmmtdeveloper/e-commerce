import React from "react";
import { RiErrorWarningFill } from "react-icons/ri";
interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex gap-1">
      <RiErrorWarningFill className="text-red-500"/>
      <p className="pl-2 text-red-500 text-[12px] font-light">{message}</p>
    </div>
  );
};

export default ErrorMessage;
