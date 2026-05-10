export const cartStorage = {
  get: () => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("bazaria_cart");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      
      // Support both { items: [] } object shapes and direct arrays
      if (parsed && Array.isArray(parsed.items)) {
        return parsed.items;
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  set: (items: any[]) => {
    if (typeof window === "undefined") return;
    // Save standard state shape
    localStorage.setItem(
      "bazaria_cart",
      JSON.stringify({
        items,
        totalItems: items.reduce((sum, i) => sum + (i.quantity || 1), 0),
        totalAmount: items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0),
      })
    );
  },
};
