import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareHeaders } from '@/app/lib/generateSignature';
import { RootState } from '@/app/redux/store';

export const createBaseApi = (reducerPath: string) =>
  createApi({
    reducerPath,
    baseQuery: fetchBaseQuery({
      baseUrl: process.env.BASE_API_URL,
      prepareHeaders: (headers, { endpoint, getState }): void | Headers => {
        const figmaId = (getState() as RootState)?.account?.figmaUserID;
        return prepareHeaders(headers, endpoint, figmaId);
      },
    }),
    endpoints: () => ({}),
  });
