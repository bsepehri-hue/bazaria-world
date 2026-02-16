import { Ionicons } from "@expo/vector-icons";

export default function CategoryIcon({ category, size = 24, color = "black" }) {
  switch (category) {
    case "art":
      return <Ionicons name="image-outline" size={size} color={color} />;

    case "pets":
      return <Ionicons name="paw-outline" size={size} color={color} />;

    case "cars":
      return <Ionicons name="car-outline" size={size} color={color} />;

    case "homes":
      return <Ionicons name="home-outline" size={size} color={color} />;

    case "services":
      return <Ionicons name="construct-outline" size={size} color={color} />;

    case "general":
      return <Ionicons name="grid-outline" size={size} color={color} />;

    default:
      return <Ionicons name="ellipse-outline" size={size} color={color} />;
  }
}
