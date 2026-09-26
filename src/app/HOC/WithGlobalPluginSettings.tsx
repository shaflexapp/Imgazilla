import { createContext, ReactNode, useCallback, useContext } from 'react';
import { useTypedDispatch } from '@/app/redux/store';

import { EventType, UIEventType } from '@/eventType';

import { getPluginSettings, setPluginSettings } from '@/app/redux/features';
import { useWindowMessaging } from '@/app/hooks/useFigmaMessaging';
import { AnimatedPage } from '@/app/components';
import { useSelector } from 'react-redux';
import {
  globalSettingsInitState,
  GlobalSettingsType,
} from '@/plugin/FigmaGlobalSettingsManager';

type Props = {
  children: ReactNode;
};

const initialState = {
  ...globalSettingsInitState,
  updateGlobalSettings: (_settings: GlobalSettingsType) => {},
};

const GlobalPluginSettingsContext = createContext(initialState);

export const WithGlobalPluginSettingsProvider = ({ children }: Props) => {
  const dispatch = useTypedDispatch();

  const pluginSettings = useSelector(getPluginSettings);

  const handleOnUpdateGlobalSettings = useCallback(
    (payload: GlobalSettingsType) => {
      const message = {
        type: UIEventType.SET_CLIENT_STORE_DATA,
        payload: payload,
      } as MessageType;

      onSendMessage(message);
    },
    [],
  );

  const handleFigmaPluginMessages = useCallback(
    (message: MessageType) => {
      if (message?.type === EventType.UPDATE_PLUGIN_SETTINGS) {
        dispatch(setPluginSettings(message.payload?.data));
      }
    },
    [setPluginSettings],
  );

  const { onSendMessage } = useWindowMessaging(handleFigmaPluginMessages);

  return (
    <AnimatedPage>
      <GlobalPluginSettingsContext.Provider
        value={{
          settings: pluginSettings,
          updateGlobalSettings: handleOnUpdateGlobalSettings,
        }}
      >
        {children}
      </GlobalPluginSettingsContext.Provider>
    </AnimatedPage>
  );
};

export const useGlobalPluginSettings = () =>
  useContext(GlobalPluginSettingsContext);
