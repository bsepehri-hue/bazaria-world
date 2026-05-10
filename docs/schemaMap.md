📜 Transaction Schema Map

BaseTransaction (shared by all)
- transactionId: string — unique ID for the transaction  
- status: string — e.g. "pending", "complete", "failed"  
- createdAt: Date — when the transaction was created  
- updatedAt: Date — when the transaction was last updated  
- externalCosts?: number — optional audit field for fees/extra costs  

---

Txn001 — Merchant Transaction
- merchantId: string — anchor to merchant profile  
- storefrontId?: string — optional, links to storefront  
- referrerId?: string — optional, for referral payouts  
- netValue: number — merchant net after fees  
- amount: number — gross transaction amount  
- externalCosts?: number — shipping, handling, etc.  

---

Txn002 — Discount / Steward Transaction
- merchantId: string — anchor to merchant profile  
- stewardId?: string — optional, links to steward for payout tracking  
- referrerId?: string — optional, for referral discounts  
- netValue: number — merchant net after fees/discounts  
- amount: number — gross transaction amount  
- discountApplied?: number — optional, discount amount (absolute or %)  

---

Txn003 — Auction Transaction
- auctionId: string — anchor to auction event  
- bidderId: string — anchor to user placing the bid  
- merchantId?: string — optional, links to merchant/storefront  
- bidAmount: number — amount offered in the bid  
- amount: number — final transaction amount if bid wins  

---

Txn004 — Vault Transaction
- vaultId: string — anchor to vault record  
- userId: string — anchor to user who locked funds  
- amount: number — amount locked in the vault  
- lockPeriod: number — lock duration in days  

# 📜 Transaction Schema Map

## BaseTransaction (shared by all)
| Field          | Type    | Notes                                      |
|----------------|---------|--------------------------------------------|
| transactionId  | string  | Unique ID for the transaction              |
| status         | string  | e.g. "pending", "complete", "failed"       |
| createdAt      | Date    | When the transaction was created           |
| updatedAt      | Date    | When the transaction was last updated      |
| externalCosts? | number  | Optional audit field for fees/extra costs  |

---

## Txn001 — Merchant Transaction
| Field          | Type    | Notes                                      |
|----------------|---------|--------------------------------------------|
| merchantId     | string  | Anchor to merchant profile                 |
| storefrontId?  | string  | Optional, links to storefront              |
| referrerId?    | string  | Optional, for referral payouts             |
| netValue       | number  | Merchant net after fees                    |
| amount         | number  | Gross transaction amount                   |
| externalCosts? | number  | Shipping, handling, etc.                   |

---

## Txn002 — Discount / Steward Transaction
| Field           | Type    | Notes                                      |
|-----------------|---------|--------------------------------------------|
| merchantId      | string  | Anchor to merchant profile                 |
| stewardId?      | string  | Optional, links to steward for payout      |
| referrerId?     | string  | Optional, for referral discounts           |
| netValue        | number  | Merchant net after fees/discounts          |
| amount          | number  | Gross transaction amount                   |
| discountApplied?| number  | Optional, discount amount (absolute or %)  |

---

## Txn003 — Auction Transaction
| Field       | Type    | Notes                                      |
|-------------|---------|--------------------------------------------|
| auctionId   | string  | Anchor to auction event                    |
| bidderId    | string  | Anchor to user placing the bid             |
| merchantId? | string  | Optional, links to merchant/storefront      |
| bidAmount   | number  | Amount offered in the bid                  |
| amount      | number  | Final transaction amount if bid wins        |

---

## Txn004 — Vault Transaction
| Field     | Type    | Notes                                      |
|-----------|---------|-------------------------------------
| vaultId   | string  | Anchor to vault record   

   # 📜 Transaction Schema Map

## BaseTransaction (shared by all)
| Field          | Type    | Notes                                      |
|----------------|---------|--------------------------------------------|
| transactionId  | string  | Unique ID for the transaction              |
| status         | string  | e.g. "pending", "complete", "failed"       |
| createdAt      | Date    | When the transaction was created           |
| updatedAt      | Date    | When the transaction was last updated      |
| externalCosts? | number  | Optional audit field for fees/extra costs  |

---

## Txn001 — Merchant Transaction
| Field          | Type    | Notes                                      |
|----------------|---------|--------------------------------------------|
| merchantId     | string  | Anchor to merchant profile                 |
| storefrontId?  | string  | Optional, links to storefront              |
| referrerId?    | string  | Optional, for referral payouts             |
| netValue       | number  | Merchant net after fees                    |
| amount         | number  | Gross transaction amount                   |
| externalCosts? | number  | Shipping, handling, etc.                   |

---

## Txn002 — Discount / Steward Transaction
| Field           | Type    | Notes                                      |
|-----------------|---------|--------------------------------------------|
| merchantId      | string  | Anchor to merchant profile                 |
| stewardId?      | string  | Optional, links to steward for payout      |
| referrerId?     | string  | Optional, for referral discounts           |
| netValue        | number  | Merchant net after fees/discounts          |
| amount          | number  | Gross transaction amount                   |
| discountApplied?| number  | Optional, discount amount (absolute or %)  |

---

## Txn003 — Auction Transaction
| Field       | Type    | Notes                                      |
|-------------|---------|--------------------------------------------|
| auctionId   | string  | Anchor to auction event                    |
| bidderId    | string  | Anchor to user placing the bid             |
| merchantId? | string  | Optional, links to merchant/storefront      |
| bidAmount   | number  | Amount offered in the bid                  |
| amount      | number  | Final transaction amount if bid wins        |

---

## Txn004 — Vault Transaction
| Field     | Type    | Notes                                      |
|-----------|---------|--------------------------------------------|
| vaultId   | string  | Anchor to vault record                     |
| userId    | string  | Anchor to user who locked funds            |
| amount    | number  | Amount locked in the vault                 |
| lockPeriod| number  | Lock duration in days                      |

---

# 🔎 Firestore Query Examples

### Merchant Net Value (Txn001)
```ts
const merchantNetValue = async (merchantId: string) => {
  const snapshot = await db.collection('txn001')
    .where('merchantId', '==', merchantId)
    .get();

  let totalNet = 0;
  snapshot.forEach(doc => {
    totalNet += doc.data().netValue;
  });

  return totalNet;
};               |
| userId    | string  | Anchor to user who locked funds            |
| amount    | number  | Amount locked in the vault                 |
| lockPeriod| number  | Lock duration in days   

const referralPayouts = async (referrerId: string) => {
  const snapshot = await db.collection('txn002')
    .where('referrerId', '==', referrerId)
    .get();

const auctionBids = async (auctionId: string) => {
  const snapshot = await db.collection('txn003')
    .where('auctionId', '==', auctionId)
    .get();

  const bids = snapshot.docs.map(doc => ({
    bidderId: doc.data().bidderId,
    bidAmount: doc.data().bidAmount,
    amount: doc.data().amount,
  }));

  return bids;
};



  let totalReferral = 0;
  snapshot.forEach(doc => {
    totalReferral += doc.data().discountApplied || 0;
  });

  return totalReferral;
};

 const vaultLockedValue = async (vaultId: string) => {
  const snapshot = await db.collection('txn004')
    .where('vaultId', '==', vaultId)
    .get();

  let totalLocked = 0;
  snapshot.forEach(doc => {
    totalLocked += doc.data().amount;
  });

  return totalLocked;
};


# 📊 Admin Dashboard Metrics

### Transaction Counts
```ts
const transactionCounts = async () => {
  const snapshot = await db.collection('txn001').get();
  return snapshot.size; // total merchant transactions
};


const merchantTotals = async () => {
  const snapshot = await db.collection('txn001').get();
  let totalNet = 0;
  snapshot.forEach(doc => {
    totalNet += doc.data().netValue;
  });
  return totalNet;
};

const referralTotals = async () => {
  const snapshot = await db.collection('txn002').get();
  let totalReferral = 0;
  snapshot.forEach(doc => {
    totalReferral += doc.data().discountApplied || 0;
  });
  return totalReferral;
};


const referralTotals = async () => {
  const snapshot = await db.collection('txn002').get();
  let totalReferral = 0;
  snapshot.forEach(doc => {
    totalReferral += doc.data().discountApplied || 0;
  });
  return totalReferral;
};

const auctionActivity = async () => {
  const snapshot = await db.collection('txn003').get();
  return snapshot.docs.map(doc => ({
    auctionId: doc.data().auctionId,
    bidderId: doc.data().bidderId,
    bidAmount: doc.data().bidAmount,
    amount: doc.data().amount,
  }));
};

const vaultTotals = async () => {
  const snapshot = await db.collection('txn004').get();
  let totalLocked = 0;
  snapshot.forEach(doc => {
    totalLocked += doc.data().amount;
  });
  return totalLocked;
};

