"use server";

export async function markAsShipped(formData: FormData) {
  const orderId = formData.get("orderId");
  console.log("markAsShipped", orderId);
}

export async function markAsDelivered(formData: FormData) {
  const orderId = formData.get("orderId");
  console.log("markAsDelivered", orderId);
}

export async function markAsCompleted(formData: FormData) {
  const orderId = formData.get("orderId");
  console.log("markAsCompleted", orderId);
}