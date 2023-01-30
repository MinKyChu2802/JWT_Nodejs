import Dashboard from 'components/dashboard/Dashboard'
import withAuth from 'hoc/WithAuth'
import React from 'react'

const DashboardPage: any = () => {
  return <Dashboard />
}

export default withAuth(DashboardPage)
