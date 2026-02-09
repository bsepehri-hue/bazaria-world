export const calculateDeliveryRate = (delivered: number, total: number) => {
  if (total === 0) return 1;
  return delivered / total;
};
