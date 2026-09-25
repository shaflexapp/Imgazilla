import React from 'react';
import {
  createMemoryRouter,
  RouteObject,
  useRouteError,
} from 'react-router-dom';

import { TabsLayout } from '@/app/layouts/TabsLayout';
import {
  BackgroundRemoval,
  FaviconExporter,
  ImageOptimization,
  ImageOptimizationPanel,
} from '@/app/components';
import {
  APP_ROUTES_PATHS,
  BACKGROUND_REMOVAL,
  FAVICON_EXPORT,
  IMAGE_OPTIMIZATION,
  PAGE_IMAGES_OPTIMIZATION,
  SELECT_IMAGES_OPTIMIZATION,
} from '@/app/constants';
import { useSelector } from 'react-redux';
import { getImages } from '@/app/redux/features';

//TODO: Create a separate component
const ConditionalComponent = () => {
  const images = useSelector(getImages);
  return images.length === 0 ? (
    <ImageOptimizationPanel />
  ) : (
    <ImageOptimization />
  );
};

// The router catches render errors itself; rethrow them so the top-level
// error boundary in App.tsx shows the error screen and reports them to Sentry
const RouteErrorBoundary = () => {
  throw useRouteError();
};

const routes: RouteObject[] = [
  {
    path: '/',
    element: <TabsLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: APP_ROUTES_PATHS[FAVICON_EXPORT],
        element: <FaviconExporter />,
      },
      {
        path: APP_ROUTES_PATHS[IMAGE_OPTIMIZATION],
        element: <ConditionalComponent />,
      },
      {
        path: APP_ROUTES_PATHS[PAGE_IMAGES_OPTIMIZATION],
        element: <ImageOptimization />,
      },
      {
        path: APP_ROUTES_PATHS[SELECT_IMAGES_OPTIMIZATION],
        element: <ImageOptimization />,
      },
      {
        path: APP_ROUTES_PATHS[BACKGROUND_REMOVAL],
        element: <BackgroundRemoval />,
      },
    ],
  },
];

export const router = createMemoryRouter(routes, {
  initialEntries: [`/${APP_ROUTES_PATHS[FAVICON_EXPORT]}`], // Define initial route
});
