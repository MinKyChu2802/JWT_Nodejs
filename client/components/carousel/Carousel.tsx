import { NextPage } from 'next'
import React from 'react'
import { Carousel as CarouselComponent } from 'primereact/carousel'

interface Props {
  value: any
  itemTemplate?: any
  responsiveOptions?: any
}

const Carousel: NextPage<Props> = (props: Props) => {
  const { value, itemTemplate, responsiveOptions } = props

  return (
    <CarouselComponent
      value={value}
      itemTemplate={itemTemplate}
      responsiveOptions={responsiveOptions}
      showIndicators={false}
      // autoplayInterval={3000}
      numVisible={3}
      numScroll={1}
      // circular
    ></CarouselComponent>
  )
}

export default Carousel
