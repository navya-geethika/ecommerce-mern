import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import productsRoutes from "./routes/productsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import path from "path";
//configure port and add {path: .env} if .env is in other folder
dotenv.config();

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productsRoutes);
app.use(express.static(path.join(__dirname, "./frontend/dist")));

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
});
app.get("/", (req, res) => {
  res.send({ message: "Welcome!" });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
