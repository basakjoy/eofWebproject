import { useState, useEffect, useRef } from 'react';

export type ForexPair = {
    pair: string;
    rate: string;
    change: string;
    isPositive: boolean;
};

export function useForex(pairsList: string[]) {
    const [data, setData] = useState<Record<string, ForexPair>>(
        pairsList.reduce((acc, pair) => ({
            ...acc,
            [pair]: { pair, rate: '0.0000', change: '0.00%', isPositive: true }
        }), {})
    );
    const [loading, setLoading] = useState(true);
    const prevRates = useRef<Record<string, string>>({});

    const fetchRates = async () => {
        try {
            const response = await fetch('https://open.er-api.com/v6/latest/USD');
            const result = await response.json();

            if (result.result === "success") {
                const rates = result.rates;
                const updatedData: Record<string, ForexPair> = {};

                pairsList.forEach(pair => {
                    let newRateNum = 0;
                    const [base, quote] = pair.split("/");

                    if (base === "USD") {
                        newRateNum = rates[quote];
                    } else if (quote === "USD") {
                        newRateNum = 1 / rates[base];
                    } else if (rates[base] && rates[quote]) {
                        newRateNum = rates[quote] / rates[base];
                    } else {
                        // Mock for BTC/ETH or others not in base forex API
                        newRateNum = Math.random() * (pair.includes('BTC') ? 65000 : 3500);
                    }

                    const precision = pair.includes("JPY") || pair.includes("BTC") || pair.includes("ETH") ? 2 : 4;
                    const newRate = newRateNum.toFixed(precision);

                    let change = "0.00%";
                    let isPositive = true;

                    if (prevRates.current[pair]) {
                        const oldRate = parseFloat(prevRates.current[pair]);
                        const diff = newRateNum - oldRate;
                        if (oldRate > 0) {
                            const percentChange = (diff / oldRate) * 100;
                            isPositive = diff >= 0;
                            change = `${isPositive ? '+' : ''}${percentChange.toFixed(2)}%`;
                        }
                    } else {
                        // Initial random change for UI flavor
                        const randomChange = (Math.random() * 0.5) - 0.2;
                        isPositive = randomChange >= 0;
                        change = `${isPositive ? '+' : ''}${Math.abs(randomChange).toFixed(2)}%`;
                    }

                    prevRates.current[pair] = newRate;
                    updatedData[pair] = { pair, rate: newRate, change, isPositive };
                });

                setData(updatedData);
            }
        } catch (error) {
            console.error("Forex fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
        // Poll API every 15 seconds
        const apiInterval = setInterval(fetchRates, 15000);

        // Simulate sub-ticks every 2 seconds for UI "liveness"
        const tickInterval = setInterval(() => {
            setData(currentData => {
                const updated = { ...currentData };
                Object.keys(updated).forEach(pair => {
                    const p = updated[pair];
                    const rateNum = parseFloat(p.rate);
                    // Very small random movement (0.001% - 0.005%)
                    const movement = (Math.random() - 0.5) * (rateNum * 0.0001);
                    const newRate = (rateNum + movement).toFixed(p.rate.split('.')[1]?.length || 4);
                    updated[pair] = { ...p, rate: newRate };
                });
                return updated;
            });
        }, 2500);

        return () => {
            clearInterval(apiInterval);
            clearInterval(tickInterval);
        };
    }, []);


    return { data, loading, refresh: fetchRates };
}
