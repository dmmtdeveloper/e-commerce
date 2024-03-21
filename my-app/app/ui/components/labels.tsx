import React, { FC } from "react";
import clsx from "clsx";

type labelComponent = {
  name: string;
  htmlFor: string
};

const LabelComponent: FC<labelComponent> = ({ name }) => {
  return (
    <>
      <label
        className={clsx(
          "text-slate-500",
          "mb-2 block text-sm",
          "capitalize",
          "pt-2"
        )}
      >
        {name}
      </label>
    </>
  );
};

export default LabelComponent;
