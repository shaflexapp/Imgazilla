import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import mixpanel from 'mixpanel-figma';
import {
  CreateAccountBody,
  useCreateAccountMutation,
  useUpdateAccountMutation,
} from '@/app/redux/services';
import { AnimatedPage, ErrorComponent, Splash } from '@/app/components';
import { EventType } from '@/eventType';
import { useWindowMessaging } from '@/app/hooks/useFigmaMessaging';
import { AccountState, getAccount, setAccount } from '@/app/redux/features';
import { useTypedDispatch } from '@/app/redux/store';

// The sandbox sends the user data right after startup; without it the plugin
// can't identify the user, so show the error screen instead of an endless splash
const USER_ACCOUNT_DATA_TIMEOUT = 20000;

type Props = {
  children: ReactNode;
};
export const AccountStatusChecker = ({ children }: Props) => {
  const [isShowError, setIsShowError] = useState(false);
  const [isUserDataReceived, setIsUserDataReceived] = useState(false);
  const { figmaUserID } = useSelector(getAccount);
  const [onUpdateAccount, { isLoading }] = useUpdateAccountMutation();

  const [createAccount, { isLoading: isCreatingAccount }] =
    useCreateAccountMutation();

  const dispatch = useTypedDispatch();

  // The app waits for figmaUserID, so an account without it ends in the error UI
  const handleAccountLoaded = useCallback(
    (data: AccountState) => {
      if (!data?.figmaUserID) {
        setIsShowError(true);
        return;
      }

      dispatch(setAccount(data));
    },
    [dispatch],
  );

  const handleCreateAccount = useCallback(
    (userData: CreateAccountBody) => {
      createAccount(userData)
        .unwrap()
        .then(handleAccountLoaded)
        .catch(() => {
          // Any failure (HTTP, network, timeout, non-JSON body) ends in the error UI
          setIsShowError(true);
        });
    },
    [createAccount, handleAccountLoaded],
  );

  const handleFigmaPluginMessages = useCallback(
    (message: MessageType) => {
      if (message?.type === EventType.USER_ACCOUNT_DATA) {
        const userData = message?.payload?.data;
        setIsUserDataReceived(true);

        if (!userData?.id) {
          setIsShowError(true);
          return;
        }

        const { id } = userData;
        // Figma users without an avatar have a null photoUrl; the API expects a string
        const photoUrl: string = userData.photoUrl ?? '';

        mixpanel.identify(id);

        onUpdateAccount({ id, photoUrl })
          .unwrap()
          .then((data) => {
            const accountData = Object.keys(data ?? {});

            if (accountData.length > 0) {
              handleAccountLoaded(data);
              return;
            }

            handleCreateAccount({ id, name: userData.name ?? '', photoUrl });
          })
          .catch(() => {
            setIsShowError(true);
          });
      }
    },
    [onUpdateAccount, handleCreateAccount, handleAccountLoaded],
  );

  useWindowMessaging(handleFigmaPluginMessages);

  useEffect(() => {
    if (isUserDataReceived) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsShowError(true);
    }, USER_ACCOUNT_DATA_TIMEOUT);

    return () => clearTimeout(timeoutId);
  }, [isUserDataReceived]);

  if (isShowError) {
    return (
      <AnimatedPage>
        <ErrorComponent />
      </AnimatedPage>
    );
  }

  // Requests without an identity must never be sent, so the app is only usable
  // once the account is loaded
  if (isCreatingAccount || isLoading || !figmaUserID) {
    return (
      <AnimatedPage>
        <Splash />
      </AnimatedPage>
    );
  }

  return <AnimatedPage>{children}</AnimatedPage>;
};
