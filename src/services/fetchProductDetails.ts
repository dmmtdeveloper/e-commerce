import { Product } from "@/types/product";
import axiosInstance from "@/utils/axiosInstance";


interface ProductPageProps {
  params: {
    id: string;
  };
}
const fetchProductDetails = async (id: string): Promise<Product | null> => {
  try {
    const response = await axiosInstance.get(
      `/api/Productos/${id}`,
      {
        headers: {
          accept: "text/plain",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};

export default fetchProductDetails;
