import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/layout/AdminMenu";
import { Layout, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [id, setId] = useState("");

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/get-products/${params.slug}`
      );

      if (data.success) {
        setName(data.productData.name);
        setId(data.productData._id);
        setDescription(data.productData.description);
        setCategory(data.productData.category._id);
        setPrice(data.productData.price);
        setQuantity(data.productData.quantity);
        setShipping(data.productData.shipping);
        setPhoto(data.productData.photo);
      }
    } catch (e) {
      toast.error("Error in single product fetch");
    }
  };

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/all-category");
      if (data?.success) {
        setCategories(data.allCategories);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    getSingleProduct();
    getAllCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("category", category);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("shipping", shipping);
      photo && productData.append("photo", photo);

      const { data } = await axios.put(
        `/api/v1/products/update-product/${id}`,
        productData
      );
      if (data.success) {
        toast.success("Product updated Successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error in api for creating product");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `/api/v1/products/delete-product/${id}`
      );
      if (data.success) {
        toast.success("Product Deleted Successfully!");

        navigate("/dashboard/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error in api for creating product");
    }
  };

  return (
    <Layout title={"Update Product - Antra"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>

            {id && (
              <div className="m-1 w-75">
                <Select
                  variant="borderless"
                  placeholder="Select a Category"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setCategory(value);
                  }}
                  value={category}
                >
                  {categories &&
                    categories.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c.name}
                      </Option>
                    ))}
                </Select>

                <div className="mb-3">
                  <label className="btn btn-outline-warning">
                    {photo ? photo.name : "Upload Photo"}
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      hidden
                    ></input>
                  </label>
                </div>
                <div className="mb-3">
                  {photo ? (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="product pic"
                        height={"200px"}
                        className="img img-responsive"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src={`/api/v1/products/product-photo/${id}`}
                        alt="product pic"
                        height={"200px"}
                        className="img img-responsive"
                      />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter Product name"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <textarea
                    type="text"
                    value={description}
                    placeholder="Enter Product Description"
                    className="form-control"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="number"
                    value={price}
                    placeholder="Enter Product price"
                    className="form-control"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="number"
                    value={quantity}
                    placeholder="Enter Product quantity"
                    className="form-control"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <Select
                    variant="borderless"
                    placeholder="Shipping"
                    size="large"
                    showSearch
                    className="form-select mb-3"
                    onChange={(value) => setShipping(value)}
                    value={shipping ? "Yes" : "No"}
                  >
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                  </Select>
                </div>

                <div className="mb-3">
                  <button className="btn btn-warning" onClick={handleSubmit}>
                    Update Product
                  </button>
                </div>

                <div className="mb-3">
                  <button className="btn btn-danger" onClick={handleDelete}>
                    Delete Product
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
