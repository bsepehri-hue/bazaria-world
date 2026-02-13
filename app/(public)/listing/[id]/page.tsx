{/* ⭐ Details */}
<div className="mb-6">
  <h2 className="text-xl font-semibold mb-2">Details</h2>
  <div className="text-gray-700">
    <div>Category: {listing.category}</div>
    {listing.location && <div>Location: {listing.location}</div>}
    {listing.createdAt && (
      <div>
        Posted:{" "}
        {listing.createdAt.toDate
          ? listing.createdAt.toDate().toLocaleDateString()
          : ""}
      </div>
    )}
  </div>
</div>

{/* ⭐ Seller */}
{listing.storeId && (
  <div className="mt-10 p-4 border rounded-lg bg-gray-50">
    <h2 className="text-xl font-semibold mb-2">Seller</h2>

    <Link
      href={`/storefront/${listing.storeId}`}
      className="text-blue-600 hover:underline"
    >
      Visit Seller Storefront
    </Link>
  </div>
)}

</div>   {/* ← closes the main container div */}

);        {/* ← closes return(...) */}

}         {/* ← closes the component */}
