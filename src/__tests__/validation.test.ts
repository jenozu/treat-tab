import { describe, it, expect } from 'vitest';
import {
  validateProductName,
  validateCost,
  validatePrice,
  validateStock,
  validateCustomerName,
  validateDiscount,
  validatePaymentAmount,
  validateWeeklyGoal,
} from '../utils/validation';

const products = [
  { id: 'p1', name: 'Candy Belt' },
  { id: 'p2', name: 'Chocolate Bar' },
];

const customers = [
  { id: 'c1', name: 'Alice' },
  { id: 'c2', name: 'Bob' },
];

// ── validateProductName ───────────────────────────────────────────────────────

describe('validateProductName', () => {
  it('rejects empty string', () => {
    expect(validateProductName('', products)).toBe('Product name is required');
  });

  it('rejects whitespace-only string', () => {
    expect(validateProductName('   ', products)).toBe('Product name is required');
  });

  it('rejects name over 100 characters', () => {
    expect(validateProductName('a'.repeat(101), products)).toBe('Name must be under 100 characters');
  });

  it('accepts name of exactly 100 characters', () => {
    expect(validateProductName('a'.repeat(100), products)).toBe('');
  });

  it('rejects duplicate name (case-insensitive)', () => {
    expect(validateProductName('candy belt', products)).toBe('A product with this name already exists');
    expect(validateProductName('CANDY BELT', products)).toBe('A product with this name already exists');
  });

  it('allows same name when excluded id matches (edit mode)', () => {
    expect(validateProductName('Candy Belt', products, 'p1')).toBe('');
  });

  it('rejects same name as a different product in edit mode', () => {
    expect(validateProductName('Chocolate Bar', products, 'p1')).toBe('Another product already has this name');
  });

  it('accepts a unique valid name', () => {
    expect(validateProductName('Gummy Bears', products)).toBe('');
  });
});

// ── validateCost ─────────────────────────────────────────────────────────────

describe('validateCost', () => {
  it('rejects NaN', () => expect(validateCost('abc')).toBe('Must be 0 or more'));
  it('rejects negative', () => expect(validateCost('-1')).toBe('Must be 0 or more'));
  it('accepts zero', () => expect(validateCost('0')).toBe(''));
  it('accepts positive', () => expect(validateCost('1.50')).toBe(''));
});

// ── validatePrice ─────────────────────────────────────────────────────────────

describe('validatePrice', () => {
  it('rejects NaN', () => expect(validatePrice('abc')).toBe('Must be greater than 0'));
  it('rejects zero', () => expect(validatePrice('0')).toBe('Must be greater than 0'));
  it('rejects negative', () => expect(validatePrice('-5')).toBe('Must be greater than 0'));
  it('accepts positive', () => expect(validatePrice('2.99')).toBe(''));
});

// ── validateStock ─────────────────────────────────────────────────────────────

describe('validateStock', () => {
  it('rejects NaN', () => expect(validateStock('abc')).toBe('Must be 0 or more'));
  it('rejects negative', () => expect(validateStock('-1')).toBe('Must be 0 or more'));
  it('accepts zero', () => expect(validateStock('0')).toBe(''));
  it('accepts positive integer', () => expect(validateStock('50')).toBe(''));
});

// ── validateCustomerName ─────────────────────────────────────────────────────

describe('validateCustomerName', () => {
  it('rejects empty string', () => {
    expect(validateCustomerName('', customers)).toBe('Name is required');
  });

  it('rejects name over 100 characters', () => {
    expect(validateCustomerName('a'.repeat(101), customers)).toBe('Name must be under 100 characters');
  });

  it('rejects duplicate name (case-insensitive)', () => {
    expect(validateCustomerName('alice', customers)).toBe('A customer with this name already exists');
  });

  it('allows same name when excluded id matches (edit mode)', () => {
    expect(validateCustomerName('Alice', customers, 'c1')).toBe('');
  });

  it('rejects name matching another customer in edit mode', () => {
    expect(validateCustomerName('Bob', customers, 'c1')).toBe('Another customer already has this name');
  });

  it('accepts a unique valid name', () => {
    expect(validateCustomerName('Charlie', customers)).toBe('');
  });
});

// ── validateDiscount ─────────────────────────────────────────────────────────

describe('validateDiscount', () => {
  it('rejects NaN', () => expect(validateDiscount('abc')).toBe('Must be between 0 and 100'));
  it('rejects below 0', () => expect(validateDiscount('-1')).toBe('Must be between 0 and 100'));
  it('rejects above 100', () => expect(validateDiscount('101')).toBe('Must be between 0 and 100'));
  it('accepts 0', () => expect(validateDiscount('0')).toBe(''));
  it('accepts 100', () => expect(validateDiscount('100')).toBe(''));
  it('accepts mid-range value', () => expect(validateDiscount('15')).toBe(''));
});

// ── validatePaymentAmount ─────────────────────────────────────────────────────

describe('validatePaymentAmount', () => {
  it('rejects empty string', () => {
    expect(validatePaymentAmount('', 50)).toBe('Enter a valid amount');
  });

  it('rejects NaN', () => {
    expect(validatePaymentAmount('abc', 50)).toBe('Enter a valid amount');
  });

  it('rejects zero', () => {
    expect(validatePaymentAmount('0', 50)).toBe('Amount must be greater than $0');
  });

  it('rejects negative', () => {
    expect(validatePaymentAmount('-5', 50)).toBe('Amount must be greater than $0');
  });

  it('rejects amount exceeding outstanding', () => {
    expect(validatePaymentAmount('60', 50)).toBe('Amount exceeds balance of $50.00');
  });

  it('accepts amount equal to outstanding', () => {
    expect(validatePaymentAmount('50', 50)).toBe('');
  });

  it('accepts partial payment', () => {
    expect(validatePaymentAmount('25', 50)).toBe('');
  });
});

// ── validateWeeklyGoal ────────────────────────────────────────────────────────

describe('validateWeeklyGoal', () => {
  it('rejects empty string', () => expect(validateWeeklyGoal('')).toBe('Enter a valid amount'));
  it('rejects NaN', () => expect(validateWeeklyGoal('abc')).toBe('Enter a valid amount'));
  it('rejects zero', () => expect(validateWeeklyGoal('0')).toBe('Goal must be greater than $0'));
  it('rejects negative', () => expect(validateWeeklyGoal('-100')).toBe('Goal must be greater than $0'));
  it('rejects above 1,000,000', () => expect(validateWeeklyGoal('1000001')).toBe('That seems too high — max $1,000,000'));
  it('accepts 1,000,000 exactly', () => expect(validateWeeklyGoal('1000000')).toBe(''));
  it('accepts typical goal', () => expect(validateWeeklyGoal('1500')).toBe(''));
});
