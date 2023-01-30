import React, { FC } from 'react'

interface Props {
  children: React.ReactNode
}

const Background: FC<Props> = ({ children }: Props) => {
  return (
    <div className="area">
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      {children}
    </div>
  )
}

export default Background
