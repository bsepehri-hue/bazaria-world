// lib/auction.ts
export const getCategoryDurationDays = (category: string): number => {
  switch (category?.toLowerCase()) {
    case 'mobility': 
      return 7;
    case 'realestate': 
      return 30;
    case 'general':
    case 'digital': 
      return 3; // Both General and Digital are on your "fast" 3-day cycle
    default: 
      return 3; // Default fallback
  }
};
