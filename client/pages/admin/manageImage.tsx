import React from 'react'
import PrimeReact from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

PrimeReact.ripple = true
PrimeReact.appendTo = 'self'

const ManageImage = () => {
  return (
    <DataTable
      value={[]}
      responsiveLayout="scroll"
    >
      <Column
        field="code"
        header="Code"
      ></Column>
      <Column
        field="name"
        header="Name"
      ></Column>
      <Column
        field="category"
        header="Category"
      ></Column>
      <Column
        field="quantity"
        header="Quantity"
      ></Column>
    </DataTable>
  )
}

export default ManageImage
