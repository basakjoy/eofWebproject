# User Guide

## 1. What the Platform Does

Empire of Forex is a forex investment and trading intelligence platform. It provides:

- Public content such as services, trading signals, investment plans, market analysis, and blog articles
- Investor account areas for portfolio, investments, withdrawals, and transaction records
- Signal and market analysis features
- Customer support and ticket handling
- Admin-led operational controls for account access and business workflows

## 2. User Roles

The platform has several important user roles:

- End user / investor
- Admin user
- Super admin
- Support users and support agents
- Content or signal administrators

## 3. Main User Flows

### Sign Up and Sign In

The user completes the registration page and logs in through the authentication UI. The backend verifies credentials and issues tokens. The frontend preserves authentication through the global auth store and connected route guards.

### Investor Dashboard

After login, users reach a dashboard area with:

- investment overview
- transaction history
- signal records
- support center
- profile and settings

### Investments and Withdrawals

The user can review investment plans, create investments, and request withdrawals. Withdrawal APIs and transaction records drive the internal account workflow.

### Trader Signals

Users can view signal pages that show signal type, pair, price, stop loss, take profit, forex pair direction, reliability, and analytics. The frontend includes signal detail modals and risk calculator patterns.

### Support

The user can create or manage support tickets and support messages through the support route area. Admins can manage and assign ticket workflows.

## 4. How to Access the Platform

The frontend routes should be served from the Next.js app on the configured frontend port:

```text
http://localhost:3000
```

The backend should be available on:

```text
http://localhost:5000
```

## 5. Common Security Guidance

- Do not share credentials or JWT tokens.
- Use a secure password and activate MFA where available.
- Only access the admin panel through trusted environments.
- Keep financial information private and review withdrawal requests carefully.

## 6. For Investors

Recommended steps:

1. Create an account or sign in.
2. Complete profile information and settings.
3. Review investment plans and assign the plan that fits your risk appetite.
4. Monitor signal feeds and analysis screens.
5. Track transactions and portfolios inside the dashboard.
6. Submit a withdrawal request using the configured withdrawal workflow.

## 7. For Administrators

Administrators can:

- manage users and roles
- review or approve transactions and deposits
- operate signal feeds and market content
- moderate support tickets
- review user investment and withdrawal actions
- inspect analytics and platform activity logs

## 8. Production Safety

Users should only interact with the deployed platform over HTTPS and should avoid sharing login credentials across multiple sessions. Admin access should be restricted to trusted IP ranges or managed environments.
