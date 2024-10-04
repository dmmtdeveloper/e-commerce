import { ReactNode } from 'react'

interface LayoutDivComponenProps {
    children:ReactNode;
}

const LayoutDivComponent = ({children}:LayoutDivComponenProps) => {
  return (
    <div className="2xl:px-24 px-4 flex flex-col gap-8 bg-slate-100 w-full">{children}</div>
  )
}

export default LayoutDivComponent