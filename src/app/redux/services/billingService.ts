import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createBaseApi } from '@/app/redux/api';

export const BILLING_SERVICE_REDUCER_KEY = 'billingService';

const baseApi = createBaseApi(BILLING_SERVICE_REDUCER_KEY);

export interface BillingPrice {
  variantId: string;
  name: string;
  credits: number;
  price: string;
  checkoutUrl: string;
}

const HTTP_NOT_FOUND = 404;

// API versions deployed before this endpoint existed answer 404 (the proxy may
// answer with a non-JSON 404 page, which fetchBaseQuery reports as PARSING_ERROR)
const isNotFoundError = (error: FetchBaseQueryError) =>
  error.status === HTTP_NOT_FOUND ||
  (error.status === 'PARSING_ERROR' && error.originalStatus === HTTP_NOT_FOUND);

export const billingService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBillingPrices: builder.query<BillingPrice[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const { data, error } = await baseQuery('billing/prices');

        if (error) {
          // Cache "no prices" instead of an error: errored entries are refetched
          // every time the sheet opens, and each call alerts on the API side.
          // The price list then shows that prices are unavailable.
          return isNotFoundError(error) ? { data: [] } : { error };
        }

        return { data: Array.isArray(data) ? (data as BillingPrice[]) : [] };
      },
      // Prices and checkout links rarely change; the API caches them as well
      keepUnusedDataFor: 10 * 60,
    }),
  }),
});

export const { useGetBillingPricesQuery } = billingService;
