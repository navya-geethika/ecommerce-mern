import JWT from "jsonwebtoken";
import user from "../models/user.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const userDetails = await user.findById(req.user._id);
    if (userDetails.role !== 1) {
      return res.status(401).send({ message: "Access Denied!" });
    }
    next();
  } catch (error) {
    res.status(401).send(error, { message: "Error in Admin Middleware!" });
  }
};
