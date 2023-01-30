import { NextPage } from 'next'
import React from 'react'
import { Gallery as GalleryComponent } from 'react-grid-gallery'

interface Props {
  images: any
}

const Gallery: NextPage<Props> = ({ images }: Props) => {
  return <GalleryComponent images={images} />
}

export default Gallery
