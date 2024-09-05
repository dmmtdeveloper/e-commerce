import MainLayout from "./layouts/MainLayout";
import ProductsPage from "@/components/Products";

export default function Home() {
  return (
    <MainLayout>
      <ProductsPage />
    </MainLayout>
  );
}
