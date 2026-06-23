import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Currency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  { code: 'BDT', name: 'Bangladeshi Taka', flag: '🇧🇩', symbol: '৳' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
];

// Approximate exchange rates relative to USD (for display conversion)
const USD_RATES: Record<string, number> = {
  USD: 1,
  BDT: 122.64,
  EUR: 0.87,
  GBP: 0.75,
  JPY: 161.31,
};

interface CurrencyState {
  selectedCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  convertFromUSD: (usdAmount: number) => number;
  formatAmount: (usdAmount: number) => string;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      selectedCurrency: CURRENCIES[0], // Default USD

      setCurrency: (currency: Currency) => set({ selectedCurrency: currency }),

      convertFromUSD: (usdAmount: number) => {
        const { selectedCurrency } = get();
        const rate = USD_RATES[selectedCurrency.code] ?? 1;
        return usdAmount * rate;
      },

      formatAmount: (usdAmount: number) => {
        const { selectedCurrency, convertFromUSD } = get();
        const converted = convertFromUSD(usdAmount);
        return `${selectedCurrency.symbol}${converted.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
    }),
    {
      name: 'eof-currency-store',
    }
  )
);
