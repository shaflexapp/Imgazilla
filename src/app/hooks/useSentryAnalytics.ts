import { useCallback } from 'react';
import * as Sentry from '@sentry/react';

interface AnalyticsEvent {
  eventName: string;
  category?: string;
  label?: string;
  value?: number;
}

export const useSentryAnalytics = () => {
  return useCallback((event: AnalyticsEvent) => {
    const { eventName, category, label, value } = event;

    // Sentry v9 removed the metrics API; record the event as a breadcrumb instead
    Sentry.addBreadcrumb({
      category: 'analytics',
      message: eventName,
      level: 'info',
      data: {
        category,
        label,
        value,
      },
    });
  }, []);
};
