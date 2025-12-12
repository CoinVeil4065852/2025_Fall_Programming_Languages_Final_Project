export type NumberAny = number | any;

export const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

export const calcPercentage = (value: number, max: number) => {
  if (typeof max !== 'number' || Number.isNaN(max) || max === 0) {
    return 0;
  }
  return clamp((value / max) * 100, 0, 100);
};

export const formatPercentLabel = (value: number, max: number, decimals = 0) => {
  const percent = calcPercentage(value, max);
  return `${percent.toFixed(decimals)}%`;
};

export default {
  clamp,
  calcPercentage,
  formatPercentLabel,
};
