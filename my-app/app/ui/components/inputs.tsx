import React, { FC, InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = {
  type: string;
  name: string;
  id: string;
  value: string;
  onChange: any;
  
};

const InputComponent: FC<InputProps> = ({
  type,
  name,
  id,
  value,
  onChange,
  
}) => {
  return (
    <>
      <input
        type="text"
        className={clsx(
          "p-3 rounded",
          "bg-slate-900",
          "text-slate-300",
          "w-full"
        )}
      />
    </>
  );
};

export default InputComponent;
