/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next/types'
import About from 'components/about/About'
// import Carousel from 'components/carousel/Carousel'
import Gallery from 'components/gallery/Gallery'
import Layout from 'components/layout/Layout'

const Home: NextPage = () => {
  const productTemplate = (product: any) => {
    return (
      <div className="product-item">
        <div className="product-item-content">
          <div className="mb-3">
            <img
              src={product?.image}
              alt=""
              className="product-image"
              width={340}
              height={200}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="flex justify-center items-center flex-col gap-16">
        <About />
        {/* <Carousel
          responsiveOptions={RESPONSIVE_OPTIONS}
          value={VALUE.data}
          itemTemplate={(item: any) => productTemplate(item)}
        /> */}
        <Gallery />
      </div>
    </Layout>
  )
}

export default Home
