/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next'
import React, { useCallback, useEffect, useState } from 'react'
import { GalleryImage } from 'types/common'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import { useWindowSize } from 'store/windowSize'
import Skeleton from '@mui/material/Skeleton'
import Button from '@mui/material/Button'
import { get } from 'services/apiClient'
import { defaultImage } from 'configs/constants'
import { useRouter } from 'next/router'
import { apiURL } from 'routes/apiURL'

const grid = [
  { x: 2, y: 2 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
]

const grid2 = [
  [{ x: 4, y: 2 }],
  [
    { x: 2, y: 2 },
    { x: 2, y: 2 },
  ],
  [
    { x: 2, y: 2 },
    { x: 2, y: 1 },
    { x: 2, y: 1 },
  ],
]

const gridSkeletons = [0, 1, 2]

const images1: GalleryImage[] = [] || [
  {
    thumbnail: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400&h=400&fit=crop&auto=format',
    title: 'Breakfast',
    summary:
      'Vaix loonf luon dau cat moi dit con me lu chung may, Vaix loonf luon dau cat moi dit con me lu chung may, Vaix loonf luon dau cat moi dit con me lu chung may',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=400&fit=crop&auto=format',
    title: 'Burger',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=400&h=400&fit=crop&auto=format',
    title: 'Camera',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=400&h=400&fit=crop&auto=format',
    title: 'Coffee',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=400&h=400&fit=crop&auto=format',
    title: 'Hats',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop&auto=format',
    title: 'Honey',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=400&h=400&fit=crop&auto=format',
    title: 'Basketball',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=400&h=400&fit=crop&auto=format',
    title: 'Fern',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25?w=400&h=400&fit=crop&auto=format',
    title: 'Mushrooms',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400&h=400&fit=crop&auto=format',
    title: 'Tomato basil',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=400&h=400&fit=crop&auto=format',
    title: 'Sea star',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=400&h=400&fit=crop&auto=format',
    title: 'Bike',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400&h=400&fit=crop&auto=format',
    title: 'Tomato basil',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=400&h=400&fit=crop&auto=format',
    title: 'Sea star',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=400&h=400&fit=crop&auto=format',
    title: 'Bike',
  },
]

const imageListItemStyle = { borderRadius: 6, overflow: 'hidden' }

const Gallery: NextPage = () => {
  const router = useRouter()

  const { windowSize } = useWindowSize()

  // const isMobile = windowSize <= 768
  const isMobile = false

  const [gallery, setGallery] = useState<{ loading: boolean; images: GalleryImage[] }>({
    loading: true,
    images: images1,
  })

  const { loading, images } = gallery

  const loadMore = useCallback(() => {
    setGallery((prev) => ({ ...prev, loading: true }))
    get(`${process.env.NEXT_PUBLIC_SITE_URL_BE}${apiURL.apiBlog('')}`, {}, (res) => {
      setGallery((prev) => ({ loading: false, images: [...prev.images, ...res.data] }))
    })
  }, [setGallery])

  useEffect(() => {
    loadMore()
  }, [loadMore])

  return (
    <div className="w-full text-center">
      <div className="text-3xl font-semibold mb-6">Gallery</div>
      <ImageList
        sx={{ width: '100%' }}
        variant="quilted"
        cols={4}
        rowHeight={240}
        gap={8}
        className="Gallery"
      >
        {images.map((item, index) => {
          let gridItem: { x: number; y: number }

          if (images.length % 4 === 0 || index < Math.floor(images.length / 4) * 4) {
            const newIndex = index % 8
            gridItem = grid[newIndex]
          } else {
            gridItem = grid2[(images.length % 4) - 1][index % 4]
          }

          if (isMobile) gridItem = { x: 4, y: 1 }

          return (
            <ImageListItem
              key={index}
              cols={gridItem.x}
              rows={gridItem.y}
              style={imageListItemStyle}
              onClick={() => router.push(`/blogs/${item.id}`)}
            >
              <img
                src={item.thumbnail || defaultImage.src}
                alt={item.title}
                loading="lazy"
                // onError={}
              />
              <ImageListItemBar
                title={item.title}
                subtitle={item.summary}
              />
            </ImageListItem>
          )
        })}
        {loading && (
          <>
            {gridSkeletons.map((i) => (
              <ImageListItem
                key={i}
                cols={grid2[gridSkeletons.length - 1][i].x}
                rows={grid2[gridSkeletons.length - 1][i].y}
                style={imageListItemStyle}
              >
                <Skeleton
                  animation="wave"
                  height="100%"
                  width="100%"
                />
              </ImageListItem>
            ))}
          </>
        )}
      </ImageList>
      <Button
        className="mt-4"
        variant="contained"
        color="primary"
        onClick={loadMore}
      >
        Load moẻ
      </Button>
    </div>
  )
}

export default Gallery
