import { RouterProvider } from 'react-router/dom';
import { ErrorBoundary, withProfiler } from '@sentry/react';

import { ThemeProvider } from '@/app/components/theme-provider';
import { ReduxProvider } from '@/app/redux/provider';
import { AccountStatusChecker } from '@/app/HOC/AccountStatusChecker';
import {
  AnimatedPage,
  BonusModal,
  ErrorComponent,
  Toaster,
} from '@/app/components';
import { WithDefaultTabSetter } from '@/app/HOC/WithDefaultTabSetter';
import { WithGlobalPluginSettingsProvider } from '@/app/HOC/WithGlobalPluginSettings';
import { initSentry } from '@/app/configs/sentry.config';
import { initMixpanel } from '@/app/configs/mixpanel.config';
import { router } from '@/app/routes';

initSentry();
initMixpanel();

const App = () => {
  return (
    <ReduxProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='dark'
        enableSystem
        disableTransitionOnChange
      >
        <div className='bg-primary-mainDark h-full'>
          {/* Reports render crashes to Sentry and shows the error screen instead of a blank plugin */}
          <ErrorBoundary
            fallback={
              <AnimatedPage>
                <ErrorComponent />
              </AnimatedPage>
            }
          >
            {/* Outside AccountStatusChecker so the relaunch command and the startup plugin settings are handled even during the splash */}
            <WithDefaultTabSetter>
              <WithGlobalPluginSettingsProvider>
                <AccountStatusChecker>
                  {/*
                    React Router 6 applied navigations synchronously; v7+ wraps
                    them in startTransition unless this is false. Keep v6
                    behaviour: the routes read Redux (useSyncExternalStore) state.
                  */}
                  <RouterProvider router={router} useTransitions={false} />
                </AccountStatusChecker>
              </WithGlobalPluginSettingsProvider>
            </WithDefaultTabSetter>
            <Toaster />
            <BonusModal />
          </ErrorBoundary>
        </div>
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default withProfiler(App);
