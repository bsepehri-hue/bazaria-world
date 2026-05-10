import React from "react";

export default function AddressBox({ address }: { address: any }) {
  if (!address) {
    return <p className="text-gray-500">No address available</p>;
  }

  return (
    <div className="text-gray-800 space-y-1">
      <p>{address.street}</p>
      <p>
        {address.city}, {address.state} {address.zip}
      </p>
      <p>{address.country}</p>
    </div>
  );
}
