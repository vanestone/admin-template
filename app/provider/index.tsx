import { ConfigProvider } from '@m-design/mui';
import zhCN from '@m-design/mui/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from '../routes';

dayjs.locale('zh-cn');

const GlobalProvider = () => {
  const router = createBrowserRouter(routes);
  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default GlobalProvider;
