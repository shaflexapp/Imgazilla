import { useCallback, useEffect } from 'react';
import mixpanel from 'mixpanel-figma';
import { isMixpanelEnabled } from '@/app/configs/mixpanel.config';

interface EventProperties {
  [key: string]: any;
}

export const useMixpanel = (options?: {
  pageName?: string;
  pageProperties?: EventProperties;
}) => {
  useEffect(() => {
    if (isMixpanelEnabled && options?.pageName) {
      mixpanel.track('Page Viewed', {
        page: options.pageName,
        ...options.pageProperties,
      });
    }
  }, [options]);

  return useCallback((eventName: string, eventProperties?: EventProperties) => {
    if (isMixpanelEnabled) mixpanel.track(eventName, eventProperties);
  }, []);
};
