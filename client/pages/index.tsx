/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next/types'
import About from 'components/about/About'
// import Carousel from 'components/carousel/Carousel'
import Gallery from 'components/gallery/Gallery'
import Layout from 'components/layout/Layout'
import axios from 'axios'
import { isSsr } from 'utils/common'

const Home: NextPage = () => {
  const getToken = () => (isSsr ? '' : localStorage.getItem('accessToken'))

  axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`

  return (
    <Layout>
      <div className="flex justify-center items-center flex-col gap-16">
        <About />
        <Gallery />
      </div>
    </Layout>
  )
}

export default Home
