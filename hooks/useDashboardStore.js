import create from "zustand";

export const useDashboardStore = create((set) => ({
  merchants: [],
  storefronts: [],
  auctions: [],
  lastUpdated: null,

  addMerchant: (merchant, ts) =>
    set((state) => ({
      merchants: [...state.merchants, merchant],
      lastUpdated: ts,
    })),

  updateStorefront: (storefront, ts) =>
    set((state) => ({
      storefronts: state.storefronts.map((s) =>
        s.id === storefront.id ? storefront : s
      ),
      lastUpdated: ts,
    })),

  closeAuction: (auction, ts) =>
    set((state) => ({
      auctions: state.auctions.map((a) =>
        a.id === auction.id ? { ...a, closed: true } : a
      ),
      lastUpdated: ts,
    })),
}));