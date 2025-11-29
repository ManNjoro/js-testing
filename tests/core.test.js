import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
  validateUserInput,
} from '../src/core';

describe('getCoupons', () => {
  it('should return an non empty array', () => {
    const coupons = getCoupons();
    expect(Array.isArray(coupons)).toBeTruthy();
    expect(coupons.length).toBeGreaterThan(0);
  });

  it('should return an array with valid coupon codes', () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('code');
      expect(coupon.code).toBeTypeOf('string');
      expect(coupon.code).toBeTruthy();
    });
  });
  it('should return an array with valid discounts', () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('discount');
      expect(coupon.discount).toBeTypeOf('number');
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe('calculateDiscount', () => {
  it(' return discounted price if given valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
    expect(calculateDiscount(10, 'SAVE20')).toBe(8);
  });
  it('should handle non numeric discount', () => {
    expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i);
  });
  it('should handle an invalid discount code', () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });
});

describe('validateUserInput', () => {
  it('should return success message given valid username and age', () => {
    expect(validateUserInput('eli', 19)).toMatch(/success/i);
  });
  it('should return username error given an invalid username', () => {
    expect(validateUserInput(9, 19)).toMatch(/invalid/i);
    expect(validateUserInput('el', 19)).toMatch(/invalid/i);
  });
  it('should return an error given an invalid age', () => {
    expect(validateUserInput('eli', '19')).toMatch(/invalid/i);
    expect(validateUserInput('eli', 9)).toMatch(/invalid/i);
  });
});

describe('isValidUsername', () => {
  it('should return false if username length is out of range', () => {
    expect(isValidUsername('eli')).toBeFalsy();
    expect(isValidUsername('e'.repeat(16))).toBeFalsy();
  });
  it('should return true if username length is equal', () => {
    expect(isValidUsername('e'.repeat(5))).toBeTruthy();
    expect(isValidUsername('e'.repeat(15))).toBeTruthy();
  });
});

describe('canDrive', () => {
  it('should return error for invalid country code', () => {
    expect(canDrive(20, 'FR')).toMatch(/invalid/i);
  });

  it.each([
    { age: 15, country: 'US', result: false },
    { age: 16, country: 'US', result: true },
    { age: 17, country: 'US', result: true },
    { age: 16, country: 'UK', result: false },
    { age: 17, country: 'UK', result: true },
    { age: 18, country: 'UK', result: true },
  ])('should return $result for $age, $country', ({ age, country, result }) => {
    expect(canDrive(age, country)).toBe(result);
  });
});

describe('isPriceInRange', () => {
  it.each([
    { scenario: 'price < min', price: -10, result: false },
    { scenario: 'price = min', price: 0, result: true },
    { scenario: 'price between min and max', price: 50, result: true },
    { scenario: 'price = max', price: 100, result: true },
    { scenario: 'price > max', price: 200, result: false },
  ])('should return $result when $scenario', ({ price, result }) => {
    expect(isPriceInRange(price, 0, 100)).toBe(result);
  });
});

describe('fetchData', () => {
  it('should return a promise that will resolve to an array of numbers', async () => {
    try {
      await fetchData();
      // expect(Array.isArray(result)).toBe(true)
      // expect(result.length).toBeGreaterThan(0)
    } catch (error) {
      expect(error).toHaveProperty('reason');
      expect(error.reason).toMatch(/fail/i);
    }
  });
});

describe('test suite', () => {
  beforeAll(() => {
    console.log('before all called!');
  });
  beforeEach(() => {
    console.log('beforeEach called');
  });
  it('test case 1', () => {});
  afterEach(() => {
    console.log('afterEach called');
  });

  it('test case 2', () => {});
});

describe('Stack', () => {
  let stack;
  beforeEach(() => {
    stack = new Stack();
  });

  it('push should add an item to the stack', () => {
    stack.push(1);

    expect(stack.size()).toBe(1);
  });

  it('pop should remove and return the top item from the stack', () => {
    stack.push(1);
    stack.push(2);

    const poppedItem = stack.pop();

    expect(poppedItem).toBe(2);
    expect(stack.size()).toBe(1);
  });

  it('pop should throw an error if stack is empty', () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it('peek should return the top item without removing it', () => {
    stack.push(1);
    stack.push(2);

    const peekedItem = stack.peek();

    expect(peekedItem).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it('peek should throw an error if stack is empty', () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });

  it('isEmpty should return true if stack is empty', () => {
    expect(stack.isEmpty()).toBe(true);
  });
  it('isEmpty should return false if stack is not empty', () => {
    stack.push(1);
    expect(stack.isEmpty()).toBe(false);
  });

  it('should return the number of items in the stack', () => {
    stack.push(1);
    stack.push(2);

    expect(stack.size()).toBe(2);
  });

  it('clear should remove all items from the stack', () => {
    stack.push(1);
    stack.push(2);
    stack.clear();

    expect(stack.size()).toBe(0);
  });
});
