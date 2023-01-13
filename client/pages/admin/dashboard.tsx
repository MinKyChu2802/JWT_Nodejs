import Dashbroad from "components/dashbroad/Dashbroad";
import withAuth from "hoc/WithAuth";
import React from "react";

const DashboardPage: any = () => {
  return <Dashbroad />;
};

export default withAuth(DashboardPage);
