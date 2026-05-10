"use client";

import {
  Car,
  Home,
  PawPrint,
  Key,
  DoorClosed,
  Map,
  Bike,
  Bus,
  Truck,
  CalendarDays,
  Wrench,
  Grid2x2,
  Palette,
} from "lucide-react";

export const CategoryIcons: Record<string, any> = {
  cars: Car,
  homes: Home,
  pets: PawPrint,
  rentals: Key,
  rooms: DoorClosed,
  land: Map,
  motorcycles: Bike,
  rvs: Bus,
  trucks: Truck,
  timeshare: CalendarDays,
  services: Wrench,
  general: Grid2x2,
  art: Palette,
};
