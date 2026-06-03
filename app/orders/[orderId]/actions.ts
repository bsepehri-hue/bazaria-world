"use server";

import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────────────────────────
// PROVISIONAL BACKEND MOCK UTILITIES 
// (Swap these with your direct Firestore or schema database adapters when binding)
// ─────────────────────────────────────────────────────────────────────────────
async function dbGetOrder(orderId: string): Promise<any> {
  // Simulating retrieval from database instance
  // In production, use: return await db.collection("orders").doc(orderId).get();
  return {
    id: orderId,
    sellerId: "CURRENT_USER_ID_OR_STUB",
    totalPriceUSD: 15000,       // Mock high-ticket sample asset configuration
    reservePriceUSD: 12000,     // Reserve baseline metric
    status: "pending"
  };
}

async function dbUpdateOrder(orderId: string, updates: Record<string, any>) {
  console.log(`[DB UPDATE] Order #${orderId} adjusted states:`, updates);
  // In production, use: await db.collection("orders").doc(orderId).update(updates);
  return true;
}

async function dbCreditSellerVaultBalance(sellerId: string, amountUSD: number, feeDeductedUSD: number, orderId: string) {
  console.log(`[VAULT BALANCING CORES] Credited Seller #${sellerId}. Net Payout: $${amountUSD}, Fee Platform Captured: $${feeDeductedUSD} for Order #${orderId}`);
  // In production, update your Vault/Earnings collection:
  // await db.collection("vaults").doc(sellerId).update({ liquidBalanceUSD: increment(amountUSD), lifetimeVolumeUSD: increment(amountUSD + feeDeductedUSD) });
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE ACTION CONTROLLERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Logistics Dispatch Trigger Engine
 */
export async function markAsShipped(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  if (!orderId) throw new Error("Missing required identifier: orderId");

  try {
    const timestamp = new Date().toISOString();
    
    await dbUpdateOrder(orderId, {
      status: "shipped",
      shippedAt: timestamp,
      updatedAt: timestamp
    });

    // Instantly purge Next.js layout cache to push data up to client-wrapper components
    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Action failure inside markAsShipped:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Carrier Arrival Attestation Engine
 */
export async function markAsDelivered(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  if (!orderId) throw new Error("Missing required identifier: orderId");

  try {
    const timestamp = new Date().toISOString();

    await dbUpdateOrder(orderId, {
      status: "delivered",
      deliveredAt: timestamp,
      updatedAt: timestamp
    });

    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Action failure inside markAsDelivered:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Escrow Settlement & Vault Distribution Engine
 */
export async function markAsCompleted(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  if (!orderId) throw new Error("Missing required identifier: orderId");

  try {
    const timestamp = new Date().toISOString();
    
    // 1. Fetch live transaction data parameters from core database
    const order = await dbGetOrder(orderId);
    if (!order) throw new Error("Transaction profile context not found.");

    // Prevent double execution loops
    if (order.status === "completed") {
      return { success: true, message: "Order is already permanently settled." };
    }

    // 2. Compute Hybrid Platform Fees matching your business guidelines
    const totalPriceUSD = order.totalPriceUSD || 0;
    const isHighTicket = totalPriceUSD >= 5000;
    const reservePriceUSD = order.reservePriceUSD || totalPriceUSD;
    const overageDelta = Math.max(0, totalPriceUSD - reservePriceUSD);

    let platformFeeUSD = 0;
    let netPayoutUSD = 0;

    if (!isHighTicket) {
      // Standard Retail Track: Flat 6% Take-Rate
      platformFeeUSD = totalPriceUSD * 0.06;
      netPayoutUSD = totalPriceUSD - platformFeeUSD;
    } else {
      // High-Ticket Escrow Track: 10% of Reserve Deposit baseline + 15% on Overage Premium pricing
      const baseDepositFee = reservePriceUSD * 0.10;
      const performanceOverageFee = overageDelta * 0.15;
      platformFeeUSD = baseDepositFee + performanceOverageFee;
      netPayoutUSD = totalPriceUSD - platformFeeUSD;
    }

    // 3. Update the Order Profile document to finalized states
    await dbUpdateOrder(orderId, {
      status: "completed",
      completedAt: timestamp
