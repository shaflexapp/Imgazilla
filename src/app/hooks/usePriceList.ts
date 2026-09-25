import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getAccount } from '@/app/redux/features';
import { useGetBillingPricesQuery } from '@/app/redux/services';
import { generateTooltip } from '@/app/lib/generatePriceTooltip';

export const usePriceList = () => {
  const accountDetails = useSelector(getAccount);

  // Checkout links are created server-side for the current user, so wait for the account
  const { data, isLoading, isUninitialized } = useGetBillingPricesQuery(
    undefined,
    { skip: !accountDetails.figmaUserID },
  );

  const princeList = useMemo<
    { price: string; link: string; credits: number; tooltip: string }[]
  >(
    () =>
      (Array.isArray(data) ? data : []).map((variant) => ({
        link: variant.checkoutUrl,
        price: variant.price,
        credits: variant.credits,
        tooltip: generateTooltip(variant.credits),
      })),
    [data],
  );

  return {
    princeList,
    isLoading: isLoading || isUninitialized,
  };
};
