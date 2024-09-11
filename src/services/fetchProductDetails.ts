import { Product } from "@/types/product";
import axios from "axios";

interface ProductPageProps {
  params: {
    id: string;
  };
}
const fetchProductDetails = async (id: string): Promise<Product | null> => {
    try {
      const response = await axios.get(
        `https://proyectosocius-hnfjbhheebgefpc7.eastus2-01.azurewebsites.net/api/Productos/${id}`,
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

  export default fetchProductDetails