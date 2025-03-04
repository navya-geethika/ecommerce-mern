import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");

      setOrders(data.order);
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title="Orders">
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
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
                        <td>{o?.status}</td>
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
      </div>
    </Layout>
  );
};

export default Orders;
