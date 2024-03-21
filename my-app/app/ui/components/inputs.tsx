import React, { ChangeEventHandler, FC } from "react";
import clsx from "clsx";

type InputProps = {
  type: string;
  name: string;
  id: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
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
        className={clsx(
          "p-3 rounded",
          "bg-slate-900",
          "text-slate-300",
          "w-full"
        )}
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange} 
      />
    </>
  );
};

export default InputComponent;
