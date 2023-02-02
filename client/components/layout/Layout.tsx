import Footer from 'components/footer/Footer'
import Header from 'components/header/Header'
import { NextPage } from 'next/types'
import React from 'react'
import { ScrollTop } from 'primereact/scrolltop'

interface Props {
  children: React.ReactNode
}

const Layout: NextPage<Props> = (props: Props) => {
  const { children } = props
  return (
    <div className="bg-primary min-h-screen flex flex-col items-start justify-between">
      <Header />
      <ScrollTop />
      <div className="max-w-[1200px] mx-auto mt-[220px] w-full">{children}</div>

      <Footer />
    </div>
  )
}

export default Layout
