import React from "react";

type buttonProps = {
  text:string

}

export const Btn:React.FC<buttonProps> = ({text}) => {
  return (
    <>
      <button className="text-slate-600 bg-slate-950 w-40 py-[3px] rounded pointer">{text}</button>
    </>
  );
};
