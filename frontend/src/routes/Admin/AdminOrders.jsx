import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/layout/AdminMenu";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { Select } from "antd";
import moment from "moment";
import toast from "react-hot-toast";
const { Option } = Select;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState([
    ["Not Process", "Processing", "Shipped", "delivered", "cancelled"],
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");

      setOrders(data.order);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleChange = async (orderId, val) => {
    try {
      const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: val,
      });
      getOrders();
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title={"Admin Orders - Antra"}>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">Orders</h1>
          {orders?.map((o, i) => {
            return (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Buyer</th>
                      <th scope="col">Date</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <Select
                        variant="borderless"
                        size="large"
                        onChange={(value) => {
                          handleChange(o._id, value);
                        }}
                        value={o.status}
                      >
                        <Option key={0} value="Not Process">
                          Not Process
                        </Option>
                        <Option key={1} value="Processing">
                          Processing
                        </Option>
                        <Option key={2} value="Shipped">
                          Shipped
                        </Option>
                        <Option key={3} value="Delivered">
                          Delivered
                        </Option>
                        <Option key={4} value="Cancelled">
                          Cancelled
                        </Option>
                      </Select>

                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createdAt).fromNow()}</td>
                      <td>{o?.payment.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="container">
                  {o?.products?.map((c, i) => (
                    <div className="row mb-2 card flex-row">
                      <div className="col-md-4">
                        <img
                          src={`/api/v1/products/product-photo/${c._id}`}
                          className="card-img-top"
                          style={{ height: "100px", width: "100px" }}
                          alt={c.name}
                        />
                      </div>
                      <div className="col-md-8">
                        <h4> {c.name} </h4>
                        <p> {c.description.substring(0, 30)} </p>
                        <p> $ {c.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
