import CheckoutForm from "@/components/checkout/CheckoutForm";

const sampleMerchantAddress = {
  name: "Retro Storefront",
  street: "501 NW 26th St",
  city: "Miami",
  state: "FL",
  zip: "33127",
  country: "US"
};

const samplePackage = {
  weight: 4.5,
  length: 12,
  width: 10,
  height: 4
};

export default function Page() {
  return (
    <CheckoutForm 
      orderTotal={120.00} 
      packageDetails={samplePackage} 
      merchantAddress={sampleMerchantAddress} 
    />
  );
}
