"use client";
import BaseListingForm from "./BaseListingForm";

export default function CreateListingForm({ category }: { category: string }) {
  return <BaseListingForm category={category}><></></BaseListingForm>;
}
