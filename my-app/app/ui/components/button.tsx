import React, { FC } from "react";
import clsx from "clsx";

type buttonProps = {
  text: string;
  submit: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ButtonComponent: FC<buttonProps> = ({ text, submit }) => {
  return (
    <>
      <button
        type="submit"
        className={clsx("border border-gray-600", "mt-4 p-2", "rounded-xl")}
      >
      </button>
    </>
  );
};

export default ButtonComponent;
