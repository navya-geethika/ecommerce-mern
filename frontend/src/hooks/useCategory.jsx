import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useCategory() {
  const [categories, setCategories] = useState([]);
  const getCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/all-category");
      setCategories(data?.allCategories);
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}
