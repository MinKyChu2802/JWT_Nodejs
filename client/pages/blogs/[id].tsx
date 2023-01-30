import Layout from 'components/layout/Layout'
import { NextPage } from 'next/types'
import React from 'react'

const BlogDetail: NextPage = ({ id, name }: any) => {
  return (
    <Layout>
      <div>Detail</div>
      <div>
        {id} + {name}
      </div>
    </Layout>
  )
}

export const getServerSideProps = async ({ params }: any) => {
  return { props: { id: params.id, name: 'dm' } }
}

export default BlogDetail
