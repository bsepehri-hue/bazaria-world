import {
  PawPrint,
  Car,
  Home,
  Wrench,
  Grid3X3,
  Building2,
  DoorOpen,
  Frame,
} from "lucide-react";

import { ArtFilled } from "./filled/ArtFilled";

export const CategoryIcons = {
  art: {
    default: Frame,
    active: ArtFilled,
  },
  pets: {
    default: PawPrint,
    active: PawPrint, // or a filled version later
  },
  cars: {
    default: Car,
    active: Car,
  },
  homes: {
    default: Home,
    active: Home,
  },
  rentals: {
    default: Building2,
    active: Building2,
  },
  rooms: {
    default: DoorOpen,
    active: DoorOpen,
  },
  services: {
    default: Wrench,
    active: Wrench,
  },
  general: {
    default: Grid3X3,
    active: Grid3X3,
  },
};
