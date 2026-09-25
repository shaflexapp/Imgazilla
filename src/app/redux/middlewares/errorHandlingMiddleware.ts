import { Middleware } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'sonner';

const SILENT_ENDPOINTS = [
  // Startup account calls render their own error screen (AccountStatusChecker)
  'updateAccount',
  'createAccount',
  // Job polling shows its own error toast and retries transient errors quietly
  'getProcessStatus',
  'getOptimizedImage',
  'getBackgroundRemovalProcessStatus',
  'getBackgroundRemovalResult',
  // The price list shows its own "prices are unavailable" notice
  'getBillingPrices',
];

// Handle error regarding credits inside the component
const NOT_ACCEPTABLE_STATUS = 406;

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again later.';

const ERROR_MESSAGES_BY_STATUS: Record<string, string> = {
  FETCH_ERROR:
    'Unable to reach the server. Please check your connection and try again.',
  TIMEOUT_ERROR: 'The request timed out. Please try again.',
  // Non-JSON body, e.g. a proxy 502/404 page while the API is being deployed
  PARSING_ERROR:
    'The server is temporarily unavailable. Please try again in a moment.',
};

type ErrorPayload = {
  status?: number | string;
  data?: unknown;
};

type ErrorBody = {
  message?: unknown;
  statusCode?: unknown;
  path?: unknown;
};

type RejectedAction = {
  payload?: ErrorPayload;
  meta?: {
    arg?: {
      endpointName?: string;
    };
  };
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getErrorBody = (payload: ErrorPayload | undefined): ErrorBody =>
  isObject(payload?.data) ? (payload.data as ErrorBody) : {};

const getErrorMessage = (payload: ErrorPayload | undefined): string => {
  const { message } = getErrorBody(payload);

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  if (Array.isArray(message) && message.length > 0) {
    return message.join(', ');
  }

  return (
    ERROR_MESSAGES_BY_STATUS[String(payload?.status)] ?? DEFAULT_ERROR_MESSAGE
  );
};

const isSilentError = (action: RejectedAction): boolean => {
  const payload = isObject(action?.payload) ? action.payload : undefined;
  const { statusCode, path } = getErrorBody(payload);

  if (
    payload?.status === NOT_ACCEPTABLE_STATUS ||
    statusCode === NOT_ACCEPTABLE_STATUS
  ) {
    return true;
  }

  const endpointName = action?.meta?.arg?.endpointName;

  return SILENT_ENDPOINTS.some(
    (name) =>
      endpointName === name ||
      (typeof path === 'string' && path.includes(name)),
  );
};

export const errorHandlingMiddleware: Middleware =
  () => (next) => (action: RejectedAction) => {
    // Never throw here: the rejected action must always reach the reducers
    try {
      if (isRejectedWithValue(action) && !isSilentError(action)) {
        const payload = isObject(action.payload) ? action.payload : undefined;

        toast.warning('Error', {
          description: getErrorMessage(payload),
        });
      }
    } catch (error) {
      console.error('Error handling middleware failed', error);
    }

    return next(action);
  };
