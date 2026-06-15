export function validateProductName(
  name: string,
  existing: { id: string; name: string }[],
  excludeId?: string
): string {
  const trimmed = name.trim();
  if (!trimmed) return 'Product name is required';
  if (trimmed.length > 100) return 'Name must be under 100 characters';
  if (existing.some(p => p.id !== excludeId && p.name.trim().toLowerCase() === trimmed.toLowerCase())) {
    return excludeId ? 'Another product already has this name' : 'A product with this name already exists';
  }
  return '';
}

export function validateCost(raw: string): string {
  const val = parseFloat(raw);
  if (isNaN(val) || val < 0) return 'Must be 0 or more';
  return '';
}

export function validatePrice(raw: string): string {
  const val = parseFloat(raw);
  if (isNaN(val) || val <= 0) return 'Must be greater than 0';
  return '';
}

export function validateStock(raw: string): string {
  const val = parseInt(raw);
  if (isNaN(val) || val < 0) return 'Must be 0 or more';
  return '';
}

export function validateCustomerName(
  name: string,
  existing: { id: string; name: string }[],
  excludeId?: string
): string {
  const trimmed = name.trim();
  if (!trimmed) return 'Name is required';
  if (trimmed.length > 100) return 'Name must be under 100 characters';
  if (existing.some(c => c.id !== excludeId && c.name.trim().toLowerCase() === trimmed.toLowerCase())) {
    return excludeId ? 'Another customer already has this name' : 'A customer with this name already exists';
  }
  return '';
}

export function validateDiscount(raw: string): string {
  const val = parseFloat(raw);
  if (isNaN(val) || val < 0 || val > 100) return 'Must be between 0 and 100';
  return '';
}

export function validatePaymentAmount(raw: string, outstanding: number): string {
  const val = parseFloat(raw);
  if (!raw || isNaN(val)) return 'Enter a valid amount';
  if (val <= 0) return 'Amount must be greater than $0';
  if (val > outstanding) return `Amount exceeds balance of $${outstanding.toFixed(2)}`;
  return '';
}

export function validateWeeklyGoal(raw: string): string {
  const val = parseFloat(raw);
  if (!raw || isNaN(val)) return 'Enter a valid amount';
  if (val <= 0) return 'Goal must be greater than $0';
  if (val > 1_000_000) return 'That seems too high — max $1,000,000';
  return '';
}
