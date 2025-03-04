import slugify from "slugify";
import products from "../models/products.js";
import categories from "../models/category.js";
import fs from "fs";
import braintree from "braintree";
import orders from "../models/orders.js";
import dotenv from "dotenv";

dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductsController = async (req, res) => {
  try {
    const { name, slug, description, shipping, quantity, price, category } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(400).send({ message: "name is required!" });
      case !description:
        return res.status(400).send({ message: "name is required!" });
      case !quantity:
        return res.status(400).send({ message: "name is required!" });
      case !price:
        return res.status(400).send({ message: "name is required!" });
      case !category:
        return res.status(400).send({ message: "name is required!" });
      case photo && photo.size > 1000000:
        return res
          .status(400)
          .send({ message: "name is required and should be less than 1mb!" });
    }

    const addProducts = new products({ ...req.fields, slug: slugify(name) });
    if (photo) {
      addProducts.photo.data = fs.readFileSync(photo.path);
      addProducts.photo.contentType = photo.type;
    }
    await addProducts.save();
    res.status(200).send({
      success: true,
      message: "Product added successfully",
      addProducts,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error while creating product!",
      error,
      success: false,
    });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const allProducts = await products
      .find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      count: allProducts.length,
      message: "Products fetched!",
      allProducts,
    });
  } catch (error) {
    res
      .status(500)
      .send({ error, message: "Error in fetching Products", success: false });
  }
};

export const getSingleproductController = async (req, res) => {
  try {
    const productData = await products
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Data fetched!",
      productData,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching Product!",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const productData = await products.findById(req.params.id).select("photo");
    if (productData.photo.data) {
      res.set("Content-type", productData.photo.contentType);
      return res.status(200).send(productData.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching Photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const deleteProduct = await products.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Product deleted successfully!",
      deleteProduct,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting Product!",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, shipping, quantity, price, category } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(400).send({ message: "name is required!" });
      case !description:
        return res.status(400).send({ message: "name is required!" });
      case !quantity:
        return res.status(400).send({ message: "name is required!" });
      case !price:
        return res.status(400).send({ message: "name is required!" });
      case !category:
        return res.status(400).send({ message: "name is required!" });
      case photo && photo.size > 1000000:
        return res
          .status(400)
          .send({ message: "name is required and should be less than 1mb!" });
    }

    const updateProduct = await products.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      updateProduct.photo.data = fs.readFileSync(photo.path);
      updateProduct.photo.contentType = photo.type;
    }
    await updateProduct.save();
    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      updateProduct,
    });
  } catch (error) {
    res.status(500).send({
      error,
      success: false,
      message: "Error updating product details!",
    });
  }
};

export const productFilterController = async (req, res) => {
  try {
    const { check, radio } = req.body;
    let args = {};
    if (check.length) args.category = check;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const productList = await products.find(args);
    res.status(200).send({
      success: true,
      productList,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Error in products filter",
      e,
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await products.find({}).estimatedDocumentCount();
    res.status(200).send({
      total,
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Error in product count",
      e,
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const listPerPage = await products
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      listPerPage,
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Error in product list as per page",
      e,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await products
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.status(200).send({
      results,
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Error in search product api",
      e,
    });
  }
};

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const results = await products
      .find({ category: cid, _id: { $ne: pid } })
      .select("-photo");
    res.status(200).send({
      results,
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Error in fetching related product api",
      e,
    });
  }
};

export const productsByCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categories.findOne({ slug: slug });

    const results = await products.find({ category }).populate("category");
    res.status(200).send({
      results,
      category,
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Error in fetching category related product api",
      e,
    });
  }
};

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Error in fetching braintree token",
      e,
    });
  }
};

export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (err, response) {
        if (response) {
          const order = new orders({
            products: cart,
            payment: response,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        }
      }
    );
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Error in fetching category related product api",
      e,
    });
  }
};
