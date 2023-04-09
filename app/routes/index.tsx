import { DefaultLayout } from '@app/layout';
import Unauthorized from '@app/pages/friendly/403';
import NotFound from '@app/pages/friendly/404';
import Home from '@app/pages/home';
import React from 'react';
import type { RouteObject } from 'react-router-dom';
import rulesets from './rulesets';
import logs from './logs';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <NotFound />,
    children: [
      {
        errorElement: <NotFound />,
        children: [
          { index: true, element: <Home /> },
          ...rulesets,
          ...logs,
          {
            path: '403',
            element: <Unauthorized />,
          },
          {
            path: '404',
            element: <NotFound />,
          },
        ],
      },
    ],
  },
];

export default routes;
