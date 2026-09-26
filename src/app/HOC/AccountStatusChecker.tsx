import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import mixpanel from 'mixpanel-figma';
import { isMixpanelEnabled } from '@/app/configs/mixpanel.config';
import {
  CreateAccountBody,
  useCreateAccountMutation,
  useUpdateAccountMutation,
} from '@/app/redux/services';
import { AnimatedPage, ErrorComponent, Splash } from '@/app/components';
import { EventType, UIEventType } from '@/eventType';
import { useWindowMessaging } from '@/app/hooks/useFigmaMessaging';
import { AccountState, getAccount, setAccount } from '@/app/redux/features';
import { useTypedDispatch } from '@/app/redux/store';

// The sandbox pushes the user data on startup and answers GET_USER_ACCOUNT_DATA;
// without it the plugin can't identify the user, so show the error screen
// instead of an endless splash
const USER_ACCOUNT_DATA_TIMEOUT = 20000;

type Props = {
  children: ReactNode;
};
export const AccountStatusChecker = ({ children }: Props) => {
  const [isShowError, setIsShowError] = useState(false);
  const [isUserDataReceived, setIsUserDataReceived] = useState(false);
  // The startup push and the reply to our request can both arrive: load the account once
  const hasHandledUserDataRef = useRef(false);
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
        if (hasHandledUserDataRef.current) return;
        hasHandledUserDataRef.current = true;

        const userData = message?.payload?.data;
        setIsUserDataReceived(true);

        if (!userData?.id) {
          setIsShowError(true);
          return;
        }

        const { id } = userData;
        // Figma users without an avatar have a null photoUrl; the API expects a string
        const photoUrl: string = userData.photoUrl ?? '';

        if (isMixpanelEnabled) mixpanel.identify(id);

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

  const { onSendMessage } = useWindowMessaging(handleFigmaPluginMessages);

  // Ask once we're listening, in case the startup push arrived before the UI mounted.
  useEffect(() => {
    onSendMessage({ type: UIEventType.GET_USER_ACCOUNT_DATA, payload: null });
  }, [onSendMessage]);

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
