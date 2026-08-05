export const SHIPPING_COST = 99;
export const FREE_SHIPPING_THRESHOLD = 2300;

export function calculateShippingCost(subtotal: number) {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  return SHIPPING_COST;
}