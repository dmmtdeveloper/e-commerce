import MainLayout from "../components/layouts/MainLayout";
import ProductsPage from "@/components/Products";

export default function Home() {
  return (
    <MainLayout>
      <ProductsPage />
    </MainLayout>
  );
}
