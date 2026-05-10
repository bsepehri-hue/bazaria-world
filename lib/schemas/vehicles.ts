// lib/schemas/vehicles.ts

export const vehicleCategories = {
  car: {
    label: "Car",
    fields: [
      { key: "year", type: "number", label: "Year" },
      { key: "make", type: "text", label: "Make" },
      { key: "model", type: "text", label: "Model" },
      { key: "mileage", type: "number", label: "Mileage" },
      { key: "vin", type: "text", label: "VIN" },
      { key: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair"] },
      { key: "bodyStyle", type: "select", label: "Body Style", options: ["Sedan", "Coupe", "Hatchback", "SUV", "Wagon", "Convertible"] },
      { key: "fuelType", type: "select", label: "Fuel Type", options: ["Gas", "Diesel", "Hybrid", "Electric"] },
      { key: "transmission", type: "select", label: "Transmission", options: ["Automatic", "Manual"] },
      { key: "drivetrain", type: "select", label: "Drivetrain", options: ["FWD", "RWD", "AWD", "4WD"] },
      { key: "engine", type: "text", label: "Engine" },
      { key: "color", type: "text", label: "Color" },
      { key: "doors", type: "number", label: "Doors" }
    ]
  },

  truck: {
    label: "Truck",
    fields: [
      { key: "year", type: "number", label: "Year" },
      { key: "make", type: "text", label: "Make" },
      { key: "model", type: "text", label: "Model" },
      { key: "mileage", type: "number", label: "Mileage" },
      { key: "vin", type: "text", label: "VIN" },
      { key: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair"] },
      { key: "drivetrain", type: "select", label: "Drivetrain", options: ["RWD", "AWD", "4WD"] },
      { key: "bedLength", type: "text", label: "Bed Length" },
      { key: "cabType", type: "select", label: "Cab Type", options: ["Regular", "Extended", "Crew"] },
      { key: "towingCapacity", type: "text", label: "Towing Capacity" },
      { key: "payload", type: "text", label: "Payload" },
      { key: "fuelType", type: "select", label: "Fuel Type", options: ["Gas", "Diesel"] },
      { key: "transmission", type: "select", label: "Transmission", options: ["Automatic", "Manual"] }
    ]
  },

  motorcycle: {
    label: "Motorcycle",
    fields: [
      { key: "year", type: "number", label: "Year" },
      { key: "make", type: "text", label: "Make" },
      { key: "model", type: "text", label: "Model" },
      { key: "mileage", type: "number", label: "Mileage" },
      { key: "vin", type: "text", label: "VIN" },
      { key: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair"] },
      { key: "type", type: "select", label: "Type", options: ["Cruiser", "Sport", "Touring", "Dirt", "Dual-Sport"] },
      { key: "engineSize", type: "number", label: "Engine Size (cc)" },
      { key: "transmission", type: "select", label: "Transmission", options: ["Manual", "Automatic"] },
      { key: "driveType", type: "select", label: "Drive Type", options: ["Chain", "Belt", "Shaft"] },
      { key: "color", type: "text", label: "Color" }
    ]
  },

  rv: {
    label: "RV",
    fields: [
      { key: "year", type: "number", label: "Year" },
      { key: "make", type: "text", label: "Make" },
      { key: "model", type: "text", label: "Model" },
      { key: "mileage", type: "number", label: "Mileage" },
      { key: "vin", type: "text", label: "VIN" },
      { key: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair"] },
      { key: "rvType", type: "select", label: "RV Type", options: ["Class A", "Class B", "Class C", "Travel Trailer", "Fifth Wheel"] },
      { key: "length", type: "text", label: "Length" },
      { key: "sleeps", type: "number", label: "Sleeps" },
      { key: "fuelType", type: "select", label: "Fuel Type", options: ["Gas", "Diesel"] },
      { key: "slideOuts", type: "number", label: "Slide-Outs" },
      { key: "weight", type: "text", label: "Weight" }
    ]
  }
};
