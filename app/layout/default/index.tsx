import { Layout } from '@m-design/mui';
import React from 'react';
import './index.less';
import LeftSider from './left-sider';
import RightContent from './right-content';

const DefaultLayout: React.FC = () => {
  return (
    <Layout className="default-layout">
      <LeftSider />
      <RightContent />
    </Layout>
  );
};

export default DefaultLayout;
