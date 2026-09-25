import {
  FAVICON_SERVICE_REDUCER_KEY,
  ACCOUNT_SERVICE_REDUCER_KEY,
  SIGNAL_SERVICE_REDUCER_KEY,
  IMAGE_OPTIMIZATION_SERVICE_REDUCER_KEY,
  BACKGROUND_REMOVAL_SERVICE_REDUCER_KEY,
  BILLING_SERVICE_REDUCER_KEY,
} from '@/app/redux/services';
import {
  faviconService,
  accountService,
  signalService,
  imageOptimizationService,
  backgroundRemovalService,
  billingService,
} from '@/app/redux/services';

import {
  faviconSlice,
  accountSlice,
  optimizationImageSlice,
  tabSlice,
  settingsSlice,
  uiSettingsSlice,
  backgroundRemovalSlice,
} from '@/app/redux/features';
import { errorHandlingMiddleware } from '@/app/redux/middlewares/errorHandlingMiddleware';

export const reducers = {
  [FAVICON_SERVICE_REDUCER_KEY]: faviconService.reducer,
  [ACCOUNT_SERVICE_REDUCER_KEY]: accountService.reducer,
  [SIGNAL_SERVICE_REDUCER_KEY]: signalService.reducer,
  [IMAGE_OPTIMIZATION_SERVICE_REDUCER_KEY]: imageOptimizationService.reducer,
  [BACKGROUND_REMOVAL_SERVICE_REDUCER_KEY]: backgroundRemovalService.reducer,
  [BILLING_SERVICE_REDUCER_KEY]: billingService.reducer,
  [faviconSlice.name]: faviconSlice.reducer,
  [accountSlice.name]: accountSlice.reducer,
  [optimizationImageSlice.name]: optimizationImageSlice.reducer,
  [tabSlice.name]: tabSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [uiSettingsSlice.name]: uiSettingsSlice.reducer,
  [backgroundRemovalSlice.name]: backgroundRemovalSlice.reducer,
};

export const middlewares = [
  accountService.middleware,
  faviconService.middleware,
  signalService.middleware,
  imageOptimizationService.middleware,
  backgroundRemovalService.middleware,
  billingService.middleware,
  errorHandlingMiddleware,
];
