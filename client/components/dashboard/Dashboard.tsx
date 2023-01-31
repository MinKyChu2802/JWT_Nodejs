import { Button, Card, CardContent } from '@mui/material'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useRef, useState } from 'react'
import { apiURL } from 'routes/apiURL'
import { get } from 'services/apiClient'
import { Toast } from 'primereact/toast'
import { ContextMenu } from 'primereact/contextmenu'
import { NextPage } from 'next'
import AddBlog from './AddBlog'

const Dashboard: NextPage = () => {
  const [blogs, setBlogs] = useState<any>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const toast = useRef<any>(null)
  const cm = useRef<any>(null)
  const [show, setShow] = useState<boolean>(false)
  const [type, setType] = useState('')

  const handleGetBlogsOrDetailBlog = (id?: string) => {
    get(`${process.env.NEXT_PUBLIC_SITE_URL_BE}${apiURL.apiBlog(id || '')}`, {}, (res) => {
      setBlogs(res.data.map((item: any, i: number) => ({ ...item, index: (res.page - 1) * res.pageSize + i + 1 })))
    })
  }

  const view = (blog: any) => {
    setType('update')
    console.log(blog)
  }

  const deleteBlog = (blog: any) => {
    console.log(blog)
  }

  const menuModel = [
    { label: 'View', icon: 'pi pi-fw pi-search', command: () => view(selectedProduct) },
    { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => deleteBlog(selectedProduct) },
  ]

  useEffect(() => {
    handleGetBlogsOrDetailBlog()
  }, [])

  return (
    <div className="w-9/12 m-auto">
      <Toast ref={toast}></Toast>

      <ContextMenu
        model={menuModel}
        ref={cm}
        onHide={() => setSelectedProduct(null)}
      />

      <AddBlog
        show={show}
        setShow={setShow}
        type={type}
        initialValues={{ content: '', title: '', thumbnail: '' }}
        setBlogs
      />

      <div className="mt-2 mb-4 flex justify-end">
        <Button
          variant="contained"
          onClick={() => {
            setShow(true)
            setType('create')
          }}
        >
          Add
        </Button>
      </div>

      <Card sx={{ minWidth: 375 }}>
        <CardContent>
          <DataTable
            value={blogs}
            paginator
            responsiveLayout="scroll"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            contextMenuSelection={selectedProduct}
            onContextMenuSelectionChange={(e) => setSelectedProduct(e.value)}
            onContextMenu={(e) => cm.current.show(e.originalEvent)}
          >
            <Column
              field="index"
              header="No"
              style={{ width: '5%' }}
            ></Column>
            <Column
              field="title"
              header="Title"
              style={{ width: '25%' }}
            ></Column>
            <Column
              field="thumbnail"
              header="Image"
              style={{ width: '15%' }}
              body={(rowData) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={rowData.thumbnail}
                  width={40}
                  height={40}
                  alt=""
                />
              )}
            ></Column>
            <Column
              field="content"
              header="Content"
              style={{ width: '35%' }}
            ></Column>
            <Column
              field="summary"
              header="Summary"
              style={{ width: '25%' }}
            ></Column>
          </DataTable>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
