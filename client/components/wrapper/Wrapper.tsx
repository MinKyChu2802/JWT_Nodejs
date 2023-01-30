import { NextPage } from 'next'
import React from 'react'

interface Props {
  title: string
  children: React.ReactNode
}

const Wrapper: NextPage<Props> = (props: Props) => {
  const { title, children } = props

  return (
    <div>
      <div className="text-[36px] font-bold mb-10 w-full text-center underline underline-offset-4">{title}</div>
      {children}
    </div>
  )
}

export default Wrapper
