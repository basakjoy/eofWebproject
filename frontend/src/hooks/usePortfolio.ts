import { useState, useEffect } from 'react';
import { investmentApi } from '@/lib/investmentApi';
import { useAuthStore } from '@/store/authStore';

interface PortfolioData {
  totalInvested: number;
  totalReturns: number;
  roi: string;
  activeInvestments: number;
  completedInvestments: number;
  investments: any[];
  recentTransactions: any[];
}

export function usePortfolio() {
  const { user } = useAuthStore();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const data = await investmentApi.getPortfolioOverview(user.id);
          setPortfolio(data.data);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching portfolio:', err);
        setError(err.response?.data?.message || 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPortfolio();
    }
  }, [user?.id]);

  return { portfolio, loading, error, refetch: () => {} };
}
