import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import "../styles/home.css";

const Landing = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [check, setCheck] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/products/product-count");
      setTotal(data.total);
    } catch (e) {
      toast.error("Error in fetching total");
    }
  };

  useEffect(() => {
    if (page == 1) return;
    loadMore();
  }, [page]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/products/product-list/${page}`);
      if (data.success) {
        setLoading(false);
        setProducts([...products, ...data.listPerPage]);
      }
    } catch (e) {
      setLoading(false);
      toast.error(error.message);
    }
  };
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/all-category");
      if (data?.success) {
        setCategories(data.allCategories);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getAllCategories();
    getTotal();
  }, []);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/products/product-list/${page}`);
      if (data.success) {
        setLoading(false);
        setProducts(data.listPerPage);
      }
    } catch (e) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleFilter = (val, id) => {
    let all = [...check];
    if (val) all.push(id);
    else {
      all = all.filter((c) => c !== id);
    }
    setCheck(all);
  };

  useEffect(() => {
    if (!check.length && !radio.length) getAllProducts();
  }, [check.length, radio.length]);

  useEffect(() => {
    if (check.length || radio.length) filterProducts();
  }, [check, radio]);

  const filterProducts = async () => {
    try {
      const { data } = await axios.post("/api/v1/products/product-filters", {
        check,
        radio,
      });
      if (data.success) {
        setProducts(data.productList);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  return (
    <Layout title={"Products - Offers"}>
      <img
        src="/images/banner.jpg"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3">
          <h4 className="text-center">Filter by Category</h4>
          <div className="d-flex flex-column ml-2">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => {
                  handleFilter(e.target.checked, c._id);
                }}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>

          <h4 className="text-center mt-3">Filter by Price</h4>
          <div className="d-flex flex-column ml-2">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>

          <div className="d-flex flex-column ml-2">
            <button
              className="btn btn-warning"
              onClick={() => window.location.reload()}
            >
              Remove Filters
            </button>
          </div>
        </div>

        <div className="col-md-9 ml-2">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products &&
              products.map((p) => (
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

                    <p className="card-text">
                      {p.description.substring(0, 60)}
                    </p>
                    <div className="card-name-price">
                      <button
                        className="btn btn-secondary ms-1"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-warning ms-1"
                        onClick={() => {
                          setCart([...cart, p]);

                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, p])
                          );
                          toast.success("Item successfully added to cart!");
                        }}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading" : "Show more"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Landing;
