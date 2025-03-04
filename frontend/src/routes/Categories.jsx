import React from "react";
import Layout from "../components/layout/Layout";
import useCategory from "../hooks/UseCategory";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title={"Category - Antra"}>
      <div className="container">
        <div className="row">
          {categories?.map((c) => (
            <div className="col-md-6 mt-4 mb-2 gx-3 gy-3">
              <Link className="btn btn-warning" to={`/category/${c.slug}`}>
                {c.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
