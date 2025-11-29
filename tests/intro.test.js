import { describe, expect, it } from 'vitest';
import { factorial, fizzBuzz, max } from '../src/intro';

describe('max', () => {
  it('should return the first argument if it is greater', () => {
    expect(max(2, 1)).toBe(2);
  });
  it('should return the second argument if it is greater', () => {
    expect(max(1, 2)).toBe(2);
  });
  it('should return the first arguments are equal', () => {
    expect(max(2, 2)).toBe(2);
  });
});

describe('fizzbuzz', () => {
  it('should return FizzBuzz if the argument is divisible by both 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
  });
  it('should return Fizz if the argument is divisible by 3', () => {
    expect(fizzBuzz(3)).toBe('Fizz');
  });
  it('should return Buzz if the argument is divisible by 5', () => {
    expect(fizzBuzz(5)).toBe('Buzz');
  });
  it('should return the argument as a string if the argument is not divisible by either 3 or 5', () => {
    expect(fizzBuzz(29)).toBe('29');
  });
});

describe('factorial', () => {
  it('should return 1 if argument is 0 or 1', () => {
    expect(factorial(0)).toBe(1);
    // expect(factorial(1)).toBe(1)
  });
  it('should return the product of all numbers that come before it including the argument', () => {
    expect(factorial(5)).toBe(120);
    // expect(factorial(1)).toBe(1)
  });
});
