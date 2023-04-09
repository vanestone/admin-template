import { Layout } from '@m-design/mui';
import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';

const { Content } = Layout;

const RightContent = () => {
  const mainContainerRef = useRef(null);

  return (
    <Layout className="right-content">
      <Header />
      <Content className="default-main" ref={mainContainerRef}>
        <Outlet context={{ mainContainerRef }} />
      </Content>
    </Layout>
  );
};
export default RightContent;
