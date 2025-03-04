import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ProductDetails.css";
import { useCart } from "../context/cart";

const ProductDetails = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProduct] = useState([]);

  useEffect(() => {
    if (params?.slug) getProducts();
  }, [params?.slug]);

  const getProducts = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/get-product/${params.slug}`
      );
      setProduct(data?.productData);
      relativeProducts(data?.productData._id, data?.productData.category._id);
    } catch (e) {
      toast.error("Error in Fetching product details");
    }
  };

  const relativeProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/related-products/${pid}/${cid}`
      );
      setRelatedProduct(data?.results);
    } catch (e) {
      toast.error("Error in Fetching product details");
    }
  };

  return (
    <Layout title={"Product details - Antra"}>
      <div>
        <div className="row container product-details">
          <div className="col-md-6">
            <img
              src={`/api/v1/products/product-photo/${product._id}`}
              className="card-img-top"
              alt={product.name}
              height="300"
              width="300px"
            />
          </div>
          <div className="col-md-6 product-details-info">
            <h1 className=" text-center">Product Details</h1>
            <h4>Name: {product.name}</h4>
            <h6>Description: {product.description}</h6>
            <h6>
              Price :
              {product?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </h6>
            <h6>Category: {product?.category?.name}</h6>

            <button
              className="btn btn-warning ms-1"
              onClick={() => {
                setCart([...cart, product]);

                localStorage.setItem(
                  "cart",
                  JSON.stringify([...cart, product])
                );
                toast.success("Item successfully added to cart!");
              }}
            >
              Add to cart
            </button>
          </div>
        </div>

        <div className="row container mt-3 similar-products">
          <h4>Similar Products</h4>
          <div className="d-flex flex-wrap">
            {relatedProducts.length
              ? relatedProducts.map((p) => (
                  <div
                    className="card m-2"
                    style={{ width: "18rem" }}
                    key={p._id}
                  >
                    <img
                      src={`/api/v1/products/product-photo/${p._id}`}
                      className="card-img-top"
                      style={{ height: "250px" }}
                      alt={p.name}
                    />
                    <div className="card-body">
                      <div className="card-name-price">
                        <h5 className="card-title">{p.name}</h5>
                        <h5 className="card-title card-price">
                          {p.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </h5>
                      </div>
                      <p className="card-text ">
                        {p.description.substring(0, 60)}...
                      </p>
                      <div className="card-name-price">
                        <button
                          className="btn btn-warning ms-1"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          More Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : "No Similar Products"}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
