export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MARKETING_ADMIN = 'marketing_admin',
  ANALYST = 'analyst',
  USER = 'user'
}

export enum Permission {
  // user management
  MANAGE_USERS = 'manage_users',
  VIEW_USERS = 'view_users',
  VIEW_ADMIN_DASHBOARD = 'view_admin_dashboard',
  CREATE_ADMIN = 'create_admin',
  DELETE_ADMIN = 'delete_admin',
  EDIT_ADMIN = 'edit_admin',
  MANAGE_SUB_ADMINS = 'manage_sub_admins',

  // signal management
  CREATE_SIGNAL = 'create_signal',
  VIEW_SIGNALS = 'view_signals',
  EDIT_SIGNALS = 'edit_signals',
  DELETE_SIGNALS = 'delete_signals',

  // insights management
  CREATE_INSIGHTS = 'create_insights',
  VIEW_INSIGHTS = 'view_insights',
  EDIT_INSIGHTS = 'edit_insights',
  DELETE_INSIGHTS = 'delete_insights',
  MANAGE_ARTICLES = 'manage_articles',
  VIEW_ARTICLES = 'view_articles',
  MANAGE_BROKERS = 'manage_brokers',
  VIEW_BROKERS = 'view_brokers',
  MANAGE_DEPOSITS = 'manage_deposits',
  VIEW_DEPOSITS = 'view_deposits',
  MANAGE_SUPPORT = 'manage_support',
  VIEW_SUPPORT = 'view_support',

  // wallet & investment management
  VIEW_WALLETS = 'view_wallets',
  VIEW_PORTFOLIO = 'view_portfolio',
  MANAGE_INVESTMENTS = 'manage_investments',
  PROCESS_WITHDRAWALS = 'process_withdrawals',
  MANAGE_SUBSCRIPTIONS = 'manage_subscriptions',

  // KYC management
  VERIFY_KYC = 'verify_kyc',
  REJECT_KYC = 'reject_kyc',
  VIEW_KYC = 'view_kyc',

  // analytics & reporting
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_REPORTS = 'view_reports',
  VIEW_ACTIVITY_LOGS = 'view_activity_logs',

  // system
  VIEW_LOGS = 'view_logs',
  MANAGE_SETTINGS = 'manage_settings'
}

// Map database roles to permissions
export const rolePermissions: Record<string, Permission[]> = {
  'super_admin': [
    // Full access
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.VIEW_ADMIN_DASHBOARD,
    Permission.CREATE_ADMIN,
    Permission.DELETE_ADMIN,
    Permission.EDIT_ADMIN,
    Permission.MANAGE_SUB_ADMINS,
    Permission.CREATE_SIGNAL,
    Permission.VIEW_SIGNALS,
    Permission.EDIT_SIGNALS,
    Permission.DELETE_SIGNALS,
    Permission.CREATE_INSIGHTS,
    Permission.VIEW_INSIGHTS,
    Permission.EDIT_INSIGHTS,
    Permission.DELETE_INSIGHTS,
    Permission.MANAGE_ARTICLES,
    Permission.VIEW_ARTICLES,
    Permission.MANAGE_BROKERS,
    Permission.VIEW_BROKERS,
    Permission.MANAGE_DEPOSITS,
    Permission.VIEW_DEPOSITS,
    Permission.MANAGE_SUPPORT,
    Permission.VIEW_SUPPORT,
    Permission.VIEW_WALLETS,
    Permission.VIEW_PORTFOLIO,
    Permission.MANAGE_INVESTMENTS,
    Permission.PROCESS_WITHDRAWALS,
    Permission.MANAGE_SUBSCRIPTIONS,
    Permission.VERIFY_KYC,
    Permission.REJECT_KYC,
    Permission.VIEW_KYC,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_ACTIVITY_LOGS,
    Permission.VIEW_LOGS,
    Permission.MANAGE_SETTINGS
  ],
  'admin': [
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.VIEW_ADMIN_DASHBOARD,
    Permission.MANAGE_SUB_ADMINS,
    Permission.CREATE_SIGNAL,
    Permission.VIEW_SIGNALS,
    Permission.EDIT_SIGNALS,
    Permission.DELETE_SIGNALS,
    Permission.CREATE_INSIGHTS,
    Permission.VIEW_INSIGHTS,
    Permission.EDIT_INSIGHTS,
    Permission.DELETE_INSIGHTS,
    Permission.MANAGE_ARTICLES,
    Permission.VIEW_ARTICLES,
    Permission.MANAGE_BROKERS,
    Permission.VIEW_BROKERS,
    Permission.MANAGE_DEPOSITS,
    Permission.VIEW_DEPOSITS,
    Permission.MANAGE_SUPPORT,
    Permission.VIEW_SUPPORT,
    Permission.VIEW_WALLETS,
    Permission.VIEW_PORTFOLIO,
    Permission.MANAGE_INVESTMENTS,
    Permission.PROCESS_WITHDRAWALS,
    Permission.MANAGE_SUBSCRIPTIONS,
    Permission.VERIFY_KYC,
    Permission.REJECT_KYC,
    Permission.VIEW_KYC,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_ACTIVITY_LOGS
  ],
  'signal_admin': [
    Permission.CREATE_SIGNAL,
    Permission.VIEW_SIGNALS,
    Permission.EDIT_SIGNALS,
    Permission.DELETE_SIGNALS,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
  ],
  'content_admin': [
    Permission.CREATE_INSIGHTS,
    Permission.VIEW_INSIGHTS,
    Permission.EDIT_INSIGHTS,
    Permission.DELETE_INSIGHTS,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
  ],
  'marketing_admin': [
    Permission.CREATE_SIGNAL,
    Permission.VIEW_SIGNALS,
    Permission.EDIT_SIGNALS,
    Permission.DELETE_SIGNALS,
    Permission.CREATE_INSIGHTS,
    Permission.VIEW_INSIGHTS,
    Permission.EDIT_INSIGHTS,
    Permission.VIEW_ANALYTICS
  ],
  'analyst': [
    Permission.VIEW_SIGNALS,
    Permission.VIEW_INSIGHTS,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS
  ],
  'user': [
    Permission.VIEW_SIGNALS,
    Permission.VIEW_INSIGHTS,
    Permission.VIEW_PORTFOLIO,
    Permission.VIEW_WALLETS
  ]
};

// Helper function to get permissions for a role
export const getPermissionsForRole = (roleName: string): Permission[] => {
  return rolePermissions[roleName] || [];
};

// Helper function to check if a role has a specific permission
export const hasPermission = (roleName: string, permission: Permission): boolean => {
  const permissions = rolePermissions[roleName] || [];
  return permissions.includes(permission);
};