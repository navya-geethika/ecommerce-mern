import user from "../models/user.js";
import { hash, compare } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import orders from "../models/orders.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, secretQuestion } = req.body;
    if (!name) return res.send({ message: "Name is required!" });
    if (!email) return res.send({ message: "Email is required!" });
    if (!password) return res.send({ message: "Password is required!" });
    if (!phone) return res.send({ message: "Phone is required!" });
    if (!address) return res.send({ message: "Address is required!" });
    if (!secretQuestion)
      return res.send({
        message: "Answer for secrurity question is required!",
      });

    const userExists = await user.findOne({ email });
    if (userExists)
      return res
        .status(400)
        .send({ message: "User Already Registered, Please login!" });

    const hashedPswd = await hash(password);
    const newUser = await new user({
      name,
      email,
      password: hashedPswd,
      phone,
      address,
      secretQuestion,
    }).save();

    res
      .status(201)
      .send({ success: true, message: "Registration Successful!", newUser });
  } catch (error) {
    res
      .status(500)
      .send({ sucess: false, message: "Registration error!", error });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email)
      return res.status(404).send({
        success: false,
        message: "Email is required!",
      });
    if (!password)
      return res.status(404).send({
        success: false,
        message: "Password is required!",
      });

    const userDetails = await user.findOne({ email });
    if (!userDetails)
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    const match = await compare(password, userDetails.password);
    if (!match)
      return res.status(400).send({
        success: false,
        message: "Invalid password!",
      });

    const token = await JWT.sign(
      { _id: userDetails._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).send({
      success: true,
      message: "Login Successful!",
      user: {
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        address: userDetails.address,
        role: userDetails.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Login error!", error });
  }
};

export const testController = (req, res) => {};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, newPassword, secretQuestion } = req.body;

    if (!email)
      return res
        .status(404)
        .send({ success: false, message: "Email is required!" });
    if (!secretQuestion)
      return res.status(404).send({
        success: false,
        message: "Answer for Security Question is required!",
      });
    if (!newPassword)
      return res
        .status(404)
        .send({ success: false, message: "New Password is required!" });
    const userDetails = await user.findOne({
      email: email,
      secretQuestion: secretQuestion,
    });
    if (!userDetails) {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }
    const hashedPswd = await hash(newPassword);
    const updatedUser = await user.findByIdAndUpdate(userDetails._id, {
      password: hashedPswd,
    });
    res
      .status(200)
      .send({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Forgot password error!" }, error);
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const userProfile = await user.findById(req.user._id);

    if (password && password.length < 6) {
      return res.json({
        error: "Password id required and should be minimum 6 character long ",
      });
    }
    const hashedPassword = password
      ? await hash(password)
      : userProfile.password;
    const updatedProfile = await user.findByIdAndUpdate(
      req.user._id,
      {
        name: name || userProfile.name,
        password: hashedPassword,
        phone: phone || userProfile.phone,
        address: address || userProfile.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile updated successfully!",
      updatedProfile,
    });
  } catch (e) {
    res.status(200).send({
      message: "Error in updating user profile",
      success: false,
      e,
    });
  }
};
export const getOrdersController = async (req, res) => {
  try {
    const order = await orders
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.status(200).send({
      success: true,
      message: "Orders fetched successfully!",
      order,
    });
  } catch (e) {
    res.status(200).send({
      message: "Error in fetching orders",
      success: false,
      e,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const order = await orders
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Orders fetched successfully!",
      order,
    });
  } catch (e) {
    res.status(200).send({
      message: "Error in fetching orders",
      success: false,
      e,
    });
  }
};

export const updateOrdersController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Orders status updated successfully!",
      order,
    });
  } catch (e) {
    res.status(200).send({
      message: "Error while updating order status",
      success: false,
      e,
    });
  }
};
