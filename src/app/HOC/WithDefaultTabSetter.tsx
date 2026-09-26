import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { useWindowMessaging } from '@/app/hooks/useFigmaMessaging';
import { EventType, UIEventType } from '@/eventType';
import { useTypedDispatch } from '@/app/redux/store';
import {
  FAVICON_TAB,
  IMAGE_OPTIMIZATION_TAB,
  setActiveTab,
  TAB_ROUTE_KEYS,
} from '@/app/redux/features';
import { AnimatedPage } from '@/app/components';
import { TAB_ROUTES } from '@/app/constants';
import { router } from '@/app/routes';

type Props = {
  children: ReactNode;
};
export const WithDefaultTabSetter = ({ children }: Props) => {
  const dispatch = useTypedDispatch();
  // The launch command can arrive twice (startup push + reply to our request);
  // apply it once so a late duplicate never overrides the user's own tab choice.
  const hasOpenedLaunchTabRef = useRef(false);

  const openTab = useCallback(
    (tab: string) => {
      if (hasOpenedLaunchTabRef.current) return;
      hasOpenedLaunchTabRef.current = true;

      dispatch(setActiveTab(tab));

      // The relaunch command is sent once on startup: open its route
      const path = TAB_ROUTES[TAB_ROUTE_KEYS[tab]]?.path;
      if (path && router.state.location.pathname !== path) {
        void router.navigate(path);
      }
    },
    [dispatch],
  );

  const handleFigmaPluginMessages = useCallback(
    (message: MessageType) => {
      if (message?.type === EventType.OPEN_IMAGES_OPTIMIZATION_TAB) {
        openTab(IMAGE_OPTIMIZATION_TAB);
      }

      if (message?.type === EventType.OPEN_FAVICON_EXPORT_TAB) {
        openTab(FAVICON_TAB);
      }
    },
    [openTab],
  );

  const { onSendMessage } = useWindowMessaging(handleFigmaPluginMessages);

  // Ask once we're listening, in case the startup push arrived before the UI mounted.
  useEffect(() => {
    onSendMessage({ type: UIEventType.GET_LAUNCH_COMMAND, payload: null });
  }, [onSendMessage]);

  return <AnimatedPage>{children}</AnimatedPage>;
};
