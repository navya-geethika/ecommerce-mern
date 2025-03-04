import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/forms/CategoryForm";
import { Modal } from "antd";

const AdminCategory = () => {
  const [categories, setCategories] = useState();
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedVal, setUpdatedVal] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        { name: updatedVal }
      );
      if (data.success) {
        toast.success("Category Name updated successfully!");
        setSelected(null);
        setUpdatedVal("");
        setVisible(false);
        getAllCategories();
      } else toast.error("Error with update api");
    } catch (e) {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${id}`
      );
      if (data.success) {
        toast.success(`${data.deleteCategory.name} deleted successfully!`);
        getAllCategories();
      } else toast.error("Error with delete api");
    } catch (e) {
      toast.error("Something went wrong!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/category/create-category", {
        name,
      });
      if (data.success) {
        toast.success(`${data.name} is created`);
        getAllCategories();
      } else toast.error("Error adding category");
    } catch (error) {
      toast.error("Something went wrong while submitting form!");
    }
  };

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/all-category");
      if (data.success) {
        setCategories(data.allCategories);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <Layout title={"Admin Category - Antra"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <CategoryForm
              handleSubmit={handleSubmit}
              value={name}
              setValue={setName}
            />
            {categories && (
              <div className="w-75">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-warning ms-2"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedVal(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => {
                              handleDelete(c._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              open={visible}
            >
              <CategoryForm
                value={updatedVal}
                setValue={setUpdatedVal}
                handleSubmit={handleUpdate}
              ></CategoryForm>
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCategory;
