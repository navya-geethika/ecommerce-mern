import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./routes/Landing";
import About from "./routes/About";
import Contact from "./routes/Contact";
import PrivacyPolicy from "./routes/PrivacyPolicy";
import PageNotFound from "./routes/PageNotFound";
import Register from "./routes/Auth/Register";
import "react-toastify/dist/ReactToastify.css";
import Login from "./routes/Auth/Login";
import Dashboard from "./routes/UserData/Dashboard";
import PrivateRoutes from "./routeGuards/PrivateRoutes";
import ForgotPassword from "./routes/Auth/ForgotPassword";
import AdminRoutes from "./routeGuards/AdminRoutes";
import AdminDashboard from "./routes/Admin/AdminDashboard";
import AdminCategory from "./routes/Admin/AdminCategory";
import AdminProducts from "./routes/Admin/AdminProducts";
import Users from "./routes/Admin/Users";
import Profile from "./routes/UserData/Profile";
import Orders from "./routes/UserData/Orders";
import Products from "./routes/Admin/Products";
import UpdateProduct from "./routes/Admin/UpdateProduct";
import Search from "./routes/Search";
import ProductDetails from "./routes/ProductDetails";
import Categories from "./routes/Categories";
import CategoryProducts from "./routes/CategoryProducts";
import CartPage from "./routes/CartPage";
import AdminOrders from "./routes/Admin/AdminOrders";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/category/:slug" element={<CategoryProducts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<PrivateRoutes />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/profile" element={<Profile />} />
          <Route path="user/orders" element={<Orders />} />
        </Route>
        <Route path="/dashboard" element={<AdminRoutes />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<AdminCategory />} />
          <Route path="admin/create-product" element={<AdminProducts />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/product/:slug" element={<UpdateProduct />} />
        </Route>
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
