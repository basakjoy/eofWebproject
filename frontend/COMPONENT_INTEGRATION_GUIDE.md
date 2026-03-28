# Component API Integration Guide

This guide explains how to properly integrate backend APIs into frontend components.

## File Structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── api.ts              # Axios instance with interceptors
│   │   ├── authApi.ts          # Auth API endpoints
│   │   ├── investmentApi.ts    # Investment API endpoints
│   │   ├── signalsApi.ts       # Trading signals API endpoints
│   │   ├── transactionsApi.ts  # Transactions API endpoints
│   │   ├── withdrawalsApi.ts   # Withdrawals API endpoints
│   │   ├── notificationsApi.ts # Notifications API endpoints
│   │   ├── supportApi.ts       # Support/Help API endpoints
│   │   ├── brokersApi.ts       # Brokers API endpoints
│   │   ├── analysisApi.ts      # Analysis API endpoints
│   │   ├── usersApi.ts         # User management API endpoints
│   │   ├── adminApi.ts         # Admin API endpoints
│   │   └── index.ts            # Central exports
│   ├── hooks/
│   │   ├── usePortfolio.ts     # Portfolio data hook
│   │   ├── useSignals.ts       # Signals data hook
│   │   └── useNotifications.ts # Notifications hook
│   ├── components/
│   │   ├── auth/               # Auth components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── admin/              # Admin components
│   │   └── ...
│   └── store/
│       ├── authStore.ts        # Auth state management
│       └── themeStore.ts       # Theme state management
```

## Integration Patterns

### Pattern 1: Using Custom Hooks (Recommended)

For components that need to fetch and display data:

```typescript
'use client';

import { usePortfolio } from '@/hooks/usePortfolio';
import { useSignals } from '@/hooks/useSignals';

export function MyDashboard() {
  const { portfolio, loading: portfolioLoading } = usePortfolio();
  const { signals, loading: signalsLoading } = useSignals({ limit: 10 });

  if (portfolioLoading || signalsLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1>Portfolio Value: ${portfolio?.totalInvested}</h1>
      {signals.map(signal => (
        <div key={signal.id}>{signal.pair}</div>
      ))}
    </div>
  );
}
```

### Pattern 2: Direct API Calls in useEffect

For more complex data fetching with custom logic:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { investmentApi } from '@/lib/investmentApi';
import { useAuthStore } from '@/store/authStore';

export function InvestmentsList() {
  const { user } = useAuthStore();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const data = await investmentApi.getUserInvestments(user.id, {
          status: 'active',
          limit: 20,
        });
        setInvestments(data.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchInvestments();
    }
  }, [user?.id]);

  return <div>{/* render investments */}</div>;
}
```

### Pattern 3: Handling Form Submissions

For forms that submit data to the API:

```typescript
'use client';

import { useState } from 'react';
import { withdrawalsApi } from '@/lib/withdrawalsApi';
import { useToast } from '@/hooks/use-toast';

export function WithdrawalForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    amount: '',
    method: 'bank_transfer',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await withdrawalsApi.requestWithdrawal({
        amount: parseFloat(formData.amount),
        method: formData.method,
      });
      toast({ title: 'Success', description: 'Withdrawal request submitted' });
      // Reset form or navigate
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to submit';
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

## Component Integration Checklist

### Authentication Components
- [x] LoginForm - Uses `authApi.login()`
- [x] RegisterForm - Uses `authApi.register()`
- [ ] ForgotPasswordForm - Should use password reset API
- [ ] VerifyOTPForm - Should use OTP verification API

### Dashboard Components
- [x] InvestorDashboard - Uses `investmentApi.getPortfolioOverview()`
- [ ] UserDashboard - Should use `investmentApi` or `usersApi`
- [ ] SignalsCard - Should use `signalsApi.getAllSignals()`
- [ ] RecentArticlesCard - Should use `analysisApi`
- [ ] UserActivityCard - Should use `transactionsApi`

### Investment Components
- [ ] InvestmentsList - Should use `investmentApi.getUserInvestments()`
- [ ] InvestmentDetail - Should use `investmentApi.getInvestment()`
- [ ] InvestmentForm - Should use `investmentApi.createInvestment()`
- [ ] InvestmentDelete - Should use `investmentApi.deleteInvestment()` (if available)

### Transaction Components
- [ ] TransactionsList - Should use `transactionsApi.getUserTransactions()`
- [ ] TransactionDetail - Should use `transactionsApi.getTransactionById()`

### Withdrawal Components
- [ ] WithdrawalsList - Should use `withdrawalsApi.getAllWithdrawals()`
- [ ] WithdrawalForm - Should use `withdrawalsApi.requestWithdrawal()`
- [ ] WithdrawalDetail - Should use `withdrawalsApi.getWithdrawalById()`

### Support Components
- [ ] SupportTickets - Should use `supportApi.getUserTickets()`
- [ ] TicketForm - Should use `supportApi.createTicket()`
- [ ] TicketDetail - Should use `supportApi.getTicketById()`
- [ ] TicketMessages - Should use `supportApi.getTicketMessages()`

### Admin Components
- [ ] AdminDashboard - Should use `adminApi.getDashboardStats()`
- [ ] UserManager - Should use `usersApi.getAllUsers()`
- [ ] WithdrawalApproval - Should use `withdrawalsApi` endpoints
- [ ] SignalManager - Should use `signalsApi` endpoints
- [ ] AdminLogs - Should use `adminApi.getAdminLogs()`

### Broker Components
- [ ] BrokersList - Should use `brokersApi.getAllBrokers()`
- [ ] BrokerDetail - Should use `brokersApi.getBrokerById()`
- [ ] BrokerReviews - Should use `brokersApi.getBrokerReviews()`

### Market Analysis Components
- [ ] AnalysisList - Should use `analysisApi.getAllAnalyses()`
- [ ] AnalysisDetail - Should use `analysisApi.getAnalysisById()`
- [ ] AnalysisForm - Should use `analysisApi.createAnalysis()`

### Notification Components
- [ ] NotificationBell - Should use `useNotifications()` hook
- [ ] NotificationCenter - Should use `notificationsApi`
- [ ] NotificationPreferences - Should use `notificationsApi.getPreferences()` and `updatePreferences()`

## Error Handling Best Practices

```typescript
try {
  const data = await apiFunction();
} catch (error: any) {
  // Extract error message from API response
  const errorMessage = error.response?.data?.message || 'An error occurred';
  
  // Handle specific error codes
  if (error.response?.status === 401) {
    // Handle unauthorized - user should login
    router.push('/login');
  } else if (error.response?.status === 403) {
    // Handle forbidden - user doesn't have permission
    showErrorMessage('You do not have permission');
  } else if (error.response?.status === 404) {
    // Handle not found
    showErrorMessage('Resource not found');
  } else {
    // Handle other errors
    showErrorMessage(errorMessage);
  }
}
```

## Loading States

Always provide visual feedback while data is loading:

```typescript
if (loading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage message={error} />;
}

return <YourContent data={data} />;
```

## Pagination Example

```typescript
const [page, setPage] = useState(1);
const limit = 20;

useEffect(() => {
  const fetchData = async () => {
    const data = await investmentApi.getUserInvestments(userId, {
      limit,
      offset: (page - 1) * limit,
    });
    setInvestments(data.data);
    setTotal(data.total);
  };
  fetchData();
}, [page]);
```

## Caching with React Query (Optional Enhancement)

For better data management, consider using React Query:

```typescript
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio', userId],
    queryFn: () => investmentApi.getPortfolioOverview(userId),
  });

  // ...
}
```

## Token Management

The authentication token is automatically:
1. Stored in localStorage on login
2. Retrieved from localStorage for each request
3. Added to Authorization header by axios interceptor
4. Removed on logout or 401 response

No manual token management is needed in components!

## Summary

1. **Use custom hooks** when fetching data for display
2. **Use direct API calls** in useEffect for complex logic
3. **Handle errors** gracefully with user-friendly messages
4. **Show loading states** while fetching data
5. **Keep components clean** - separate data fetching from UI
6. **Don't duplicate API calls** - create hooks instead
7. **Validate API responses** before using the data
8. **Log errors** to console for debugging

For more information, see `API_INTEGRATION_GUIDE.md`
