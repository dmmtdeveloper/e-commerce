import React, { FC } from "react";
import clsx from "clsx";

type buttonProps = {
  text: string;
};

const ButtonComponent: FC<buttonProps> = ({ text }) => {
  return (
    <>
      <button
        className={clsx("border border-gray-600", "mt-4 p-2", "rounded-xl")}
      >
        {text}
      </button>
    </>
  );
};

export default ButtonComponent;
