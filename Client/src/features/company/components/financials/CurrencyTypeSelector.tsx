import React from 'react';
import { ChevronDown } from 'lucide-react';

interface CurrencySelectorProps {
    availableCurrencies: string[];
    selectedCurrency: string;
    onCurrencyChange: (currency: string) => void;
}

const CurrencySelector = ({
                              availableCurrencies,
                              selectedCurrency,
                              onCurrencyChange
                          }: CurrencySelectorProps) => {
    return (
        <div className="relative">
            <select
                value={selectedCurrency}
                onChange={(e) => onCurrencyChange(e.target.value)}
                className="appearance-none bg-surface border border-border rounded-lg px-4 py-2 pr-10 text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
                {availableCurrencies?.map(currency => (
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary pointer-events-none h-4 w-4" />
        </div>
    );
};

export default CurrencySelector;