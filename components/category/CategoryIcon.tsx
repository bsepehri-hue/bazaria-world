import { Ionicons } from "@expo/vector-icons";

export default function CategoryIcon({
  category,
  active = false,
  size = 24,
  color = "black",
}) {
  const icons = {
    art: active ? "image" : "image-outline",
    pets: active ? "paw" : "paw-outline",
    cars: active ? "car" : "car-outline",
    homes: active ? "home" : "home-outline",
    rentals: active ? "business" : "business-outline",
    rooms: active ? "door" : "door-outline",
    services: active ? "construct" : "construct-outline",
    general: active ? "grid" : "grid-outline",
  };

  return <Ionicons name={icons[category]} size={size} color={color} />;
}
