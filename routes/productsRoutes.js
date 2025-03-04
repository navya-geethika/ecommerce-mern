import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductsController,
  deleteProductController,
  getAllProductsController,
  getSingleproductController,
  productCountController,
  productFilterController,
  productListController,
  productPhotoController,
  productsByCategoryController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productsController.js";
import formidable from "express-formidable";
const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductsController
);

router.get("/get-products", getAllProductsController);

router.get("/get-product/:slug", getSingleproductController);

router.get("/product-photo/:id", productPhotoController);

router.delete(
  "/delete-product/:id",
  requireSignIn,
  isAdmin,
  deleteProductController
);

router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

router.post("/product-filters", productFilterController);

router.get("/product-count", productCountController);

router.get("/product-list/:page", productListController);

router.get("/search/:keyword", searchProductController);

router.get("/related-products/:pid/:cid", relatedProductController);

router.get("/product-category/:slug", productsByCategoryController);

router.get("/braintree/token", braintreeTokenController);

router.post("/braintree/payment", requireSignIn, braintreePaymentController);
export default router;
