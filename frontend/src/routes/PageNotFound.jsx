import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

const PageNotFound = () => {
  return (
    <Layout title={"Page Not Found - Antra"}>
      <div className="pageNotFound">
        <h1 className="pnfText">404. Page Not Found!</h1>
        <Link className="btn btn-warning mt-3" to="/">
          Go Back
        </Link>
      </div>
    </Layout>
  );
};

export default PageNotFound;
