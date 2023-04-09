import PageLoading from '@app/components/page-loading';
import React, { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
const LogsLazy = lazy(() => import('@app/pages/logs'));

const Logs = (
  <React.Suspense fallback={<PageLoading />}>
    <LogsLazy />
  </React.Suspense>
);

const logs: RouteObject[] = [
  {
    path: '/logs',
    element: Logs,
  },
];

export default logs;
