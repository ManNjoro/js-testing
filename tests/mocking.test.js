import { describe, expect, it, vi } from 'vitest';
import { trackPageView } from '../src/libs/analytics';
import { getExchangeRate } from '../src/libs/currency';
import { sendEmail } from '../src/libs/email';
import { charge } from '../src/libs/payment';
import security from '../src/libs/security';
import { getShippingQuote } from '../src/libs/shipping';
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from '../src/mocking';

vi.mock('../src/libs/currency.js');
vi.mock('../src/libs/shipping.js');
vi.mock('../src/libs/analytics.js');
vi.mock('../src/libs/payment.js');
vi.mock('../src/libs/email.js', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

describe('test suite', () => {
  it('test case', () => {
    const sendText = vi.fn();
    sendText.mockImplementation(() => 'ok');

    const result = sendText('Hey');

    expect(sendText).toHaveBeenCalled();
    expect(result).toBe('ok');
  });
});

describe('getPriceInCurrency', () => {
  it('should return price in target currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);
    const price = getPriceInCurrency(10, 'AUD');

    expect(price).toBe(15);
  });
});

describe('getShippingInfo', () => {
  it('should return the shipping cost and estimated days', () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 3 });

    const result = getShippingInfo('Kenya');

    expect(result).toMatch(/shipping cost: \$10 \(3 days\)/i);
  });

  it('should return unavailable if no info', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const result = getShippingInfo('Kenya');

    expect(result).toMatch(/unavailable/i);
  });
});

describe('renderPage', () => {
  it('should return correct content', async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/);
  });

  it('should call analytics', async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith('/home');
  });
});

describe('submitOrder', () => {
  const order = { totalAmount: 20 };
  const creditCard = { creditCardNumber: '289' };
  it('should return success true when payment status passes', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });
    const result = await submitOrder(order, creditCard);
    expect(result).toHaveProperty('success', true);
  });

  it('should return success false when payment status passes', async () => {
    vi.mocked(charge).mockReturnValue({ status: 'failed' });
    const result = await submitOrder(order, creditCard);
    expect(result).toHaveProperty('error');
  });

  it('should charge the customer', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });

    await submitOrder(order, creditCard);
    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });
});

describe('signUp', () => {
  const email = 'name@domain.com';

  it('should return false if email is not valid', async () => {
    const result = await signUp('a');

    expect(result).toBe(false);
  });
  it('should return true if email is valid', async () => {
    const result = await signUp('name@domain.com');

    expect(result).toBe(true);
  });

  it('should send the welcome email if email is valid', async () => {
    await signUp(email);

    expect(sendEmail).toHaveBeenCalledOnce();
    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe('login', () => {
  const email = 'name@domain.com';
  it('should email then one time login code', async () => {
    const spy = vi.spyOn(security, 'generateCode');
    await login(email);

    const securityCode = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

describe('isOnline', () => {
  it('should return false if current hour is outside opening hours', () => {
    vi.setSystemTime('2024-01-01 07:59');
    expect(isOnline()).toBe(false);

    vi.setSystemTime('2024-01-01 20:01');
    expect(isOnline()).toBe(false);
  });

  it('should return true if current hour is within opening hours', () => {
    vi.setSystemTime('2024-01-01 08:00');
    expect(isOnline()).toBe(true);

    vi.setSystemTime('2024-01-01 19:59');
    expect(isOnline()).toBe(true);
  });
});

describe('getDiscount', () => {
  it('should return 20% discount if day is christmas', () => {
    vi.setSystemTime('2024-12-25 08:00');
    expect(getDiscount()).toBe(0.2);
    vi.setSystemTime('2024-12-25 23:59');
    expect(getDiscount()).toBe(0.2);
  });

  it('should return 0 if not christmas', () => {
    vi.setSystemTime('2024-11-25 08:00');
    expect(getDiscount()).toBe(0);
    vi.setSystemTime('2024-11-25 23:59');
    expect(getDiscount()).toBe(0);
  });
});
