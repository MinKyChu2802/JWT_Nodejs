import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { REQUIRED_FIELD_MESSAGE } from 'configs/constants'
import { Editor } from 'primereact/editor'
import { Button } from 'primereact/button'
import { get, post } from 'services/apiClient'
import { apiURL } from 'routes/apiURL'

type BlogType = {
  content?: string
  title?: string
  thumbnail?: string
}

interface Props {
  show: boolean
  setShow: (show: boolean) => void
  type: 'create' | 'update' | string
  initialValues: BlogType
  setBlogs?: any
}

const AddBlog: NextPage<Props> = (props: Props) => {
  const { show, setShow, type, initialValues, setBlogs } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [text, setText] = useState<any>(null)
  const isUpdate = type === 'update'

  const validationSchema = Yup.object().shape({
    title: Yup.string().min(0).required(REQUIRED_FIELD_MESSAGE).typeError(REQUIRED_FIELD_MESSAGE),
    content: Yup.string().min(0).required(REQUIRED_FIELD_MESSAGE).typeError(REQUIRED_FIELD_MESSAGE),
    thumbnail: Yup.string().min(0).required(REQUIRED_FIELD_MESSAGE).typeError(REQUIRED_FIELD_MESSAGE),
  })

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onTouched',
  })

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
    trigger,
  } = form

  const handleGetBlogsOrDetailBlog = (id?: string) => {
    get(`${process.env.NEXT_PUBLIC_SITE_URL_BE}${apiURL.apiBlog(id || '')}`, {}, (res) => {
      setBlogs(res.data.map((item: any, i: number) => ({ ...item, index: (res.page - 1) * res.pageSize + i + 1 })))
    })
  }

  useEffect(() => {
    if (show) {
      reset(initialValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  const onSubmit = handleSubmit((data: any) => {
    const { content, title, thumbnail } = data

    setShow(false)
    const body = { content, title, thumbnail }

    post(
      `${process.env.NEXT_PUBLIC_SITE_URL_BE}${apiURL.apiBlog('')}`,
      { ...body },
      {
        headers: {
          Authorization: localStorage.getItem('accessToken'),
          'Content-Type: ': ' application/json       ',
        },
      },
      (res) => {
        handleGetBlogsOrDetailBlog()
      }
    )
  })

  return (
    <Dialog open={show}>
      <DialogTitle>{isUpdate ? 'Update Blog' : 'Add Blog'}</DialogTitle>

      <DialogContent>
        <form onSubmit={onSubmit}>
          <Controller
            name="title"
            control={control}
            render={({ field: { value, onChange, name } }) => (
              <>
                <TextField
                  id={name}
                  value={value}
                  onChange={(e: any) => onChange(e.target.value)}
                  className="mb-4 w-full"
                  variant="standard"
                  label="Title"
                />
                {/* {!!errors.content && <div className="invalid-feedback">{errors.content}</div>} */}
              </>
            )}
          />
          <Controller
            name="content"
            control={control}
            render={({ field: { value, onChange, name } }) => (
              <>
                <Editor
                  id={name}
                  name="content"
                  value={value}
                  onTextChange={(e) => onChange(e.textValue)}
                  style={{ height: '550px' }}
                />
                {/* {!!errors.content && <div className="invalid-feedback">{errors.content}</div>} */}
              </>
            )}
          />

          <Controller
            name="thumbnail"
            control={control}
            render={({ field: { value, onChange, name } }) => (
              <>
                <TextField
                  id={name}
                  value={value}
                  onChange={(e: any) => onChange(e.target.value)}
                  className="mb-4 w-full"
                  variant="standard"
                  label="Nhập link ảnh"
                />
                {/* {!!errors.content && <div className="invalid-feedback">{errors.content}</div>} */}
              </>
            )}
          />

          <div className="flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
            <Button type="submit">Submit</Button>
            <Button
              type="button"
              color="secondary"
              onClick={() => setShow(false)}
            >
              Close
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddBlog
