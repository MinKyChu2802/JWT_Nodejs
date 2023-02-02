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
import Wrapper from 'components/wrapper/Wrapper'

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

const images1: GalleryImage[] = []

const imageListItemStyle = { borderRadius: 6, overflow: 'hidden' }

const Gallery: NextPage = () => {
  const router = useRouter()
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
      <Wrapper title="Gallery">
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
          variant="text"
          color="success"
          onClick={loadMore}
        >
          Load more
        </Button>
      </Wrapper>
    </div>
  )
}

export default Gallery
