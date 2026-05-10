export default function ProductPage({
  params,
}: {
  params: { storeId: string; productId: string };
}) {
  const { storeId, productId } = params;

  // Temporary mock product — we replace this with Firestore later
  const product = {
    id: productId,
    title: "Sample Product",
    price_in_cents: 4999,
    description: "This is a placeholder product description.",
    image: "/images/sample-product-1.jpg",
  };

  return (
    <div className="l2b-page">
      <main className="l2b-container l2b-py-8 max-w-3xl">

        {/* Product image */}
        <div className="l2b-card-image-wrapper l2b-mb-6">
          <img
            src={product.image}
            alt={product.title}
            className="l2b-card-image"
          />
        </div>

        {/* Title */}
        <h1 className="l2b-text-3xl l2b-text-bold l2b-mb-4">
          {product.title}
        </h1>

        {/* Price */}
        <p className="l2b-price l2b-text-xl l2b-mb-6">
          ${(product.price_in_cents / 100).toFixed(2)}
        </p>

        {/* Description */}
        <p className="l2b-text-base l2b-text-muted l2b-mb-12">
          {product.description}
        </p>

        {/* Buy button */}
        <button className="l2b-button l2b-button-primary l2b-w-full l2b-text-lg">
          Buy Now
        </button>

      </main>
    </div>
  );
}