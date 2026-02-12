/**
 * Formats a number as Indian Rupees (INR) with proper locale formatting
 * @param amount - The numeric amount to format
 * @returns Formatted string with ₹ symbol (e.g., "₹1,234.50")
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
