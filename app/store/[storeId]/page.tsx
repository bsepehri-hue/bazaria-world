import Image from "next/image";
import Link from "next/link";
import AuctionCard from "../../components/AuctionCard";



type StorePageProps = {
  params: {
    storeId: string;
  };
};

const mockStore = {
  id: "demo-store",
  name: "Demo Store",
  logoUrl: "/images/demo-store-logo.png", // put your logo into /public/images
  description: "Handpicked deals, curated auctions, and trusted fulfillment.",
};

const mockProducts = [
  {
    id: "prod-1",
    name: "Sample Product One",
    price: 49.99,
    imageUrl: "/images/sample-product-1.jpg",
  },
  {
    id: "prod-2",
    name: "Sample Product Two",
    price: 79.99,
    imageUrl: "/images/sample-product-2.jpg",
  },
  {
    id: "prod-3",
    name: "Sample Product Three",
    price: 29.99,
    imageUrl: "/images/sample-product-3.jpg",
  },
];

const mockAuctions = [
  {
    id: "auc-1",
    title: "Limited Edition Collectible",
    currentBidEth: 0.42,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(), // +6h
  },
  {
    id: "auc-2",
    title: "Signed Merch Bundle",
    currentBidEth: 0.18,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // +24h
  },
];

export default function StorePage({ params }: { params: { storeId: string } }) {
  const { storeId } = params;

  // Later: fetch real store by storeId from Firestore
  const store = mockStore;

  return (
    <div className="l2b-page">
  <main className="l2b-container l2b-py-8">
        {/* Store header */}
<section className="mb-8 flex items-center gap-4 border-b border-slate-200 pb-6">
  <section className="l2b-section-header l2b-flex l2b-items-center l2b-gap-4 l2b-border-b l2b-pb-6">
    <div className="l2b-avatar">
      <Image
        src={store.logoUrl}
        alt={`${store.name} logo`}
        fill
        sizes="64px"
        className="object-cover"
      />
    </div>

    <div className="l2b-flex-col l2b-gap-1">
      <h1 className="l2b-text-2xl l2b-text-bold">{store.name}</h1>

      <p className="l2b-text-muted">{store.description}</p>

      <p className="l2b-text-xs l2b-text-muted-light">
        Store ID: <span className="l2b-font-mono">{storeId}</span>
      </p>
    </div>
  </section>   {/* inner section */}
</section>     {/* outer section */}

        {/* Products section */}
        <section className="mb-10">
        <div className="l2b-flex-between l2b-mb-4">
  <h2 className="l2b-section-title">Products</h2>

  <Link href="#" className="l2b-link-muted">
    View all
  </Link>
</div>

          {mockProducts.length === 0 ? (
            <div className="l2b-empty">
  <p className="l2b-empty-description">No products listed yet.</p>
</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockProducts.map((product) => (
               <Link
  key={product.id}
  href={`/store/${store.id}/product/${product.id}`}
  className="l2b-card l2b-flex-col l2b-gap-3 l2b-cursor-pointer"
>
  <div className="l2b-card-image-wrapper">
    <Image
      src={product.imageUrl}
      alt={product.name}
      fill
      sizes="(max-width: 768px) 50vw, 33vw"
      className="l2b-card-image"
    />
  </div>

  <h3 className="l2b-text-sm l2b-text-bold line-clamp-2">
    {product.name}
  </h3>

  <p className="l2b-price">${product.price.toFixed(2)}</p>
</Link>
              ))}
            </div>
          )}
        </section>

        {/* Auctions section */}
        <section>
          <div className="l2b-flex-between l2b-mb-4">
  <h2 className="l2b-section-title">Live & Upcoming Auctions</h2>

  <Link href="#" className="l2b-link-muted">
    View all auctions
  </Link>
</div>

       {mockAuctions.length === 0 ? (
  <div className="l2b-empty">
  <p className="l2b-empty-description">No auctions are active for this store.</p>
</div>
) : (
  <div className="l2b-flex-col l2b-gap-3">
    {mockAuctions.map((auction) => (
      <AuctionCard
        key={auction.id}
        auction={{
          imageUrl: "/images/default-auction.jpg", // or real image later
          listingName: auction.title,
          description: `Ends: ${new Date(auction.endsAt).toLocaleString()}`,
          currentBid: auction.currentBidEth,
          startingBid: auction.currentBidEth,
        }}
      />
    ))}
  </div>
)}
        </section>
      </main>
    </div>
  );
}
