import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  slug: {
    type: String,
    lowercase: true,
  },

  //   description: {
  //     type: String,
  //     required: true
  //   },

  //   price: {
  //     type: Number,
  //     required: true
  //   }
});
export default mongoose.model("Category", categorySchema);
