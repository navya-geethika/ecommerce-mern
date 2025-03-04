import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import "../styles/cart.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const removeCartItem = (id) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === id);
      myCart.splice(index, 1);
      setCart(myCart);

      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const getPaymentGatewayToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/products/braintree/token");
      setClientToken(data?.clientToken);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handlepayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/products/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("payment successful");
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  useEffect(() => {
    getPaymentGatewayToken();
  }, [auth?.token]);

  return (
    <Layout title={"Cart - Antra"}>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}

              <p className="text-center">
                {cart?.length > 0
                  ? `You have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to continue"
                    }`
                  : "Your cart is empty"}
              </p>
            </h1>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-7">
              {cart?.map((c) => (
                <div className="row mb-2 card flex-row">
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/products/product-photo/${c._id}`}
                      className="card-img-top"
                      style={{ height: "100px", width: "100px" }}
                      alt={c.name}
                    />
                  </div>
                  <div className="col-md-4">
                    <h4> {c.name} </h4>
                    <p> {c.description.substring(0, 30)} </p>
                    <p> $ {c.price}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-warning mb-2"
                      onClick={() => {
                        removeCartItem(c._id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary">
              <h4>Summary</h4>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total: {calculateTotal()}</h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Profile
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning"
                      onClick={() => navigate("/login", { state: "/cart" })}
                    >
                      Please Login to Checkout
                    </button>
                  )}
                </div>
              )}

              <div className="mt-2">
                {!clientToken || !cart.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                    <button className="btn btn-warning" onClick={handlepayment}>
                      {loading ? "Processing" : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
