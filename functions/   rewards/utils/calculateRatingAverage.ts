export const calculateRatingAverage = (currentAvg: number, count: number, newRating: number) => {
  if (count === 0) return newRating;
  return (currentAvg * count + newRating) / (count + 1);
};
