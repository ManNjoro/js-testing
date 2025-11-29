import { it, expect, describe } from 'vitest';
import { calculateDiscount } from '../src/main.js';
describe('calculateDiscount', () => {
  it(' return discounted price if given valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
    expect(calculateDiscount(10, 'SAVE20')).toBe(8);
  });
});
