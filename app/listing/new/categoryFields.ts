export const categoryFields = {
  auto: [
    { name: "year", label: "Year", type: "number" },
    { name: "make", label: "Make", type: "text" },
    { name: "model", label: "Model", type: "text" },
    { name: "mileage", label: "Mileage", type: "number" },
    { name: "vin", label: "VIN", type: "text" },
  ],

  trucks: [
    { name: "year", label: "Year", type: "number" },
    { name: "make", label: "Make", type: "text" },
    { name: "model", label: "Model", type: "text" },
    { name: "towingCapacity", label: "Towing Capacity", type: "number" },
    { name: "bedLength", label: "Bed Length", type: "text" },
  ],
  
rvs: [
  { name: "rvType", label: "RV Type", type: "text" }, // e.g., Class A, Class C, Travel Trailer
  { name: "drive", label: "Drive (Towable or Motorized)", type: "text" },
  { name: "sleeps", label: "Sleeps", type: "number" },
  { name: "length", label: "Length (ft)", type: "number" },
  { name: "weight", label: "Weight (lbs)", type: "number" },
  { name: "slideOuts", label: "Slide-Outs", type: "number" },
  { name: "fuelType", label: "Fuel Type", type: "text" }, // Gas, Diesel
  { name: "year", label: "Year", type: "number" },
  { name: "mileage", label: "Mileage", type: "number" },
],


  motorcycles: [
    { name: "year", label: "Year", type: "number" },
    { name: "make", label: "Make", type: "text" },
    { name: "model", label: "Model", type: "text" },
    { name: "engineSize", label: "Engine Size (cc)", type: "number" },
  ],

  properties: [
    { name: "beds", label: "Bedrooms", type: "number" },
    { name: "baths", label: "Bathrooms", type: "number" },
    { name: "sqft", label: "Square Footage", type: "number" },
    { name: "yearBuilt", label: "Year Built", type: "number" },
  ],

  general: [
    { name: "brand", label: "Brand", type: "text" },
    { name: "condition", label: "Condition", type: "text" },
  ],

  services: [
    { name: "rate", label: "Hourly Rate", type: "number" },
    { name: "serviceArea", label: "Service Area", type: "text" },
  ],
};
