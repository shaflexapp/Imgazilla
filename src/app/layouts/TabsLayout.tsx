import { useCallback } from 'react';
import { Outlet } from 'react-router';
import { useSelector } from 'react-redux';

import { Account, Navigation } from '@/app/components';
import { useMixpanel } from '@/app/hooks/useMixpanleAnalytics';
import { TAB_ROUTES } from '@/app/constants';
import { getActiveTabRouteKey } from '@/app/redux/features';

export const TabsLayout = () => {
  const trackClick = useMixpanel();
  // Tab opened by the relaunch command; it only changes once, on startup
  const activeTabRouteKey = useSelector(getActiveTabRouteKey);

  const handleOnClick = useCallback((item: string) => {
    trackClick('click', {
      name: item,
    });
  }, []);

  return (
    <div className='flex p-3 h-full w-full'>
      <Navigation key={activeTabRouteKey} defaultValue={activeTabRouteKey}>
        <div className='flex justify-center gap-1.5'>
          <Navigation.List>
            {Object.keys(TAB_ROUTES).map((item, index) => {
              const { name, path } = TAB_ROUTES[item];
              return (
                <Navigation.Item
                  key={index}
                  asLink
                  to={path}
                  value={item}
                  onClick={() => handleOnClick(item)}
                >
                  {name}
                </Navigation.Item>
              );
            })}
          </Navigation.List>
          <Account />
        </div>
        <div className='flex mt-2 h-full w-full'>
          <Navigation.Content>
            <Outlet />
          </Navigation.Content>
        </div>
      </Navigation>
    </div>
  );
};
