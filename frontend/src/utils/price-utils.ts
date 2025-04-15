/**
 * Utilities for handling price display and calculations
 */

/**
 * Format a price value with locale string, handling null/undefined values
 * @param price The price value (can be null/undefined)
 * @param defaultValue What to display if price is null/undefined
 * @returns Formatted price or default value
 */
export const formatPrice = (price: number | null | undefined, defaultValue: string = '-'): string => {
  if (price == null) return defaultValue;
  return price.toLocaleString();
};

/**
 * Format a price with currency symbol
 * @param price The price value (can be null/undefined)
 * @param currency The currency symbol
 * @param unit Optional unit to append
 * @returns Formatted price with currency
 */
export const formatCurrencyPrice = (
  price: number | null | undefined, 
  currency: string = '৳', 
  unit?: string,
  defaultValue: string = '-'
): string => {
  if (price == null) return defaultValue;
  return `${currency}${price.toLocaleString()}${unit ? `/${unit}` : ''}`;
};

/**
 * Format a price change with sign and percentage
 * @param change The change value
 * @param includePercent Whether to include percentage sign
 * @param alwaysShowSign Whether to show + sign for positive values
 * @returns Formatted change
 */
export const formatPriceChange = (
  change: number | null | undefined,
  includePercent: boolean = true,
  alwaysShowSign: boolean = true,
  defaultValue: string = '-'
): string => {
  if (change == null) return defaultValue;
  
  const prefix = change > 0 && alwaysShowSign ? '+' : '';
  const value = Math.round(change).toLocaleString();
  const suffix = includePercent ? '%' : '';
  
  return `${prefix}${value}${suffix}`;
}; 