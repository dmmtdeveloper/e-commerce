import React from 'react'

interface LabelComponent {
    text:string,
    className?:string
}

const LabelComponent:React.FC<LabelComponent> = ({text, className}) => {
  return (
    <label className={`font-semibold text-sm text-pretty ${className}`}>{text}</label>
  )
}

export default LabelComponent