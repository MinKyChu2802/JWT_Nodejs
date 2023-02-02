import { NextPage } from 'next'
import React from 'react'

interface Props {
  title: string
  children?: React.ReactNode
  isSmall?: boolean
}

const Wrapper: NextPage<Props> = (props: Props) => {
  const { title, children, isSmall } = props

  return (
    <div>
      <div
        className={`${isSmall ? 'text-base' : 'text-[36px]'} uppercase font-bold ${
          isSmall ? 'mb-2' : 'mb-10'
        } w-full text-center ${isSmall ? '' : 'underline underline-offset-8'}  `}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

export default Wrapper
