import { ReactNode, useCallback } from 'react';
import { useWindowMessaging } from '@/app/hooks/useFigmaMessaging';
import { EventType } from '@/eventType';
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

  const openTab = useCallback(
    (tab: string) => {
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

  useWindowMessaging(handleFigmaPluginMessages);

  return <AnimatedPage>{children}</AnimatedPage>;
};
