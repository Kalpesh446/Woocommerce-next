import ProductDetailPage from "@/view/app/productDetailPage";

export default function ProductPage({ params }) {
  return <ProductDetailPage slug={params.slug} />;
}
