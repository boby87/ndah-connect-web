import { environment } from '../../../environments/environment';

export const APP_CONFIG = {
  name: environment.appName,
  version: '0.1.0',
  defaultLocale: 'fr-CM',
  defaultCurrency: 'XAF',
  defaultCountryCode: '+237',
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
  session: {
    inactivityTimeoutMs: 30 * 60 * 1000,
    refreshTokenBeforeExpiryMs: 60 * 1000,
  },
} as const;
