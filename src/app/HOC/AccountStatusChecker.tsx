import React, { ReactNode, useCallback, useState } from 'react';
import mixpanel from 'mixpanel-figma';
import {
  CreateAccountBody,
  useCreateAccountMutation,
  useUpdateAccountMutation,
} from '@/app/redux/services';
import { AnimatedPage, ErrorComponent, Splash } from '@/app/components';
import { EventType } from '@/eventType';
import { useWindowMessaging } from '@/app/hooks/useFigmaMessaging';
import { setAccount } from '@/app/redux/features';
import { isFetchBaseQueryError, isErrorWithMessage } from '@/app/redux/helpers';
import { useTypedDispatch } from '@/app/redux/store';

type Props = {
  children: ReactNode;
};
export const AccountStatusChecker = ({ children }: Props) => {
  const [isShowError, setIsShowError] = useState(false);
  const [onUpdateAccount, { isLoading }] = useUpdateAccountMutation();

  const [createAccount, { isLoading: isCreatingAccount }] =
    useCreateAccountMutation();

  const dispatch = useTypedDispatch();

  const handleCreateAccount = useCallback(
    (userData: CreateAccountBody) => {
      createAccount(userData)
        .unwrap()
        .then((data) => {
          dispatch(setAccount(data));
        })
        .catch((error) => {
          if (isErrorWithMessage(error)) {
            setIsShowError(true);
          }
        });
    },
    [createAccount, setAccount],
  );

  const handleFigmaPluginMessages = useCallback((message: MessageType) => {
    if (message?.type === EventType.USER_ACCOUNT_DATA) {
      const { id } = message?.payload?.data;
      mixpanel.identify(id);

      onUpdateAccount({ id, photoUrl: message?.payload?.data?.photoUrl })
        .unwrap()
        .then((data) => {
          const accountData = Object.keys(data);

          if (accountData.length > 0) {
            dispatch(setAccount(data));
            return;
          }

          handleCreateAccount(message?.payload?.data);
        })
        .catch((error) => {
          if (isFetchBaseQueryError(error)) {
            setIsShowError(true);
          }
        });
    }
  }, []);

  useWindowMessaging(handleFigmaPluginMessages);

  if (isShowError) {
    return (
      <AnimatedPage>
        <ErrorComponent />
      </AnimatedPage>
    );
  }

  if (isCreatingAccount || isLoading) {
    return (
      <AnimatedPage>
        <Splash />
      </AnimatedPage>
    );
  }

  return <AnimatedPage>{children}</AnimatedPage>;
};
