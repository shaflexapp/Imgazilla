import mixpanel from 'mixpanel-figma';

// Analytics are off when no token is configured (e.g. local dev builds), so nothing
// is sent and mixpanel does not log "Implementation error" for a missing token.
export const isMixpanelEnabled = Boolean(process.env.MIXPANEL_TOKEN);

export const initMixpanel = () => {
  if (!isMixpanelEnabled) return;

  mixpanel.init(process.env.MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV !== 'production',
    track_pageview: true,
    disable_persistence: true,
    disable_cookie: true,
  });
};
