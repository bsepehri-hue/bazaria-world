"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Order, mockOrders, OrderStatus } from '@/lib/mockData/orders';

// Mock state management (in a real app, this would hit Firestore/DB)
let orders: Order[] = [...mockOrders];

/**
 * Server Action to fetch all orders associated with the current seller/storefronts.
 */
export async function getSellerOrders(): Promise<Order[]> {
  // In a real app: filter orders by current user's sellerAddress/storefronts
  return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
}

/**
 * Server Action to fetch a single order by its ID.
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  // In a real app: fetch from DB and ensure the order belongs to the current user
  return orders.find(o => o.id === orderId) || null;
}

// Schema for updating shipping status
const ShippingSchema = z.object({
  orderId: z.string(),
  trackingNumber: z.string().min(5, "Tracking number must be at least 5 characters.").max(50),
  carrier: z.string().min(2, "Carrier is required.").max(50),
});

export type ShippingFormState = {
  success: boolean;
  message: string;
  errors?: {
    trackingNumber?: string[];
    carrier?: string[];
  };
};

/**
 * Server Action for merchant to mark an order as shipped, updating shipping details.
 */
export async function markOrderAsShipped(
  prevState: ShippingFormState,
  formData: FormData,
): Promise<ShippingFormState> {
  const validatedFields = ShippingSchema.safeParse({
    orderId: formData.get('orderId'),
    trackingNumber: formData.get('trackingNumber'),
    carrier: formData.get('carrier'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation Failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { orderId, trackingNumber, carrier } = validatedFields.data;

  // MOCK: Find and update the order in the mock array
  const orderIndex = orders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    return { success: false, message: `Order ID ${orderId} not found.` };
  }
  
  // MOCK: Update order details
  orders[orderIndex].status = 'SHIPPED';
  orders[orderIndex].shippingTrackingNumber = trackingNumber;
  orders[orderIndex].shippingCarrier = carrier;

  console.log(`[Order Action] Order ${orderId} marked as SHIPPED with carrier ${carrier}.`);

  // Revalidate the orders list and the detail page
  revalidatePath('/dashboard/orders');
  revalidatePath(`/dashboard/orders/${orderId}`);

  return { 
    success: true, 
    message: `Order ${orderId} successfully marked as SHIPPED!` 
  };
}