import { Layout, Menu, Spin } from '@m-design/mui';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import Logo from './logo';

const { Sider } = Layout;
const { SubMenu } = Menu;

const rootSubmenuKeys = ['sub1', 'sub2', 'sub3'];

const LeftSider = () => {
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const loading = false;
  const menus = [{}];
  const selectedKeys = [];

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const onMenuClick = ({ key }) => {
    if (key === location.pathname) {
      navigate(key, { replace: true });
    } else {
      navigate(key);
    }
  };

  const resizeHandler = useCallback(() => {
    const isSmall = document.body.getBoundingClientRect().width - 1 < 992;
    setCollapsed(isSmall);
  }, [setCollapsed]);

  useEffect(() => {
    if (!document.hidden) {
      const throttleResizeHandler = debounce(resizeHandler, 500);
      window.addEventListener('resize', throttleResizeHandler);
      return () => {
        window.removeEventListener('resize', throttleResizeHandler);
      };
    }
  }, [resizeHandler]);

  return (
    <Sider
      className="left-sider-menu"
      theme="light"
      trigger={null}
      collapsed={collapsed}
      collapsible
    >
      <Logo collapsed={collapsed} title="业务中心" />
      {loading ? (
        <Spin className="sider-menu center" />
      ) : menus?.length ? (
        // <Menu
        //   items={menus}
        //   mode="inline"
        //   className="sider-menu"
        //   selectedKeys={selectedKeys}
        //   openKeys={openKeys}
        //   onOpenChange={onOpenChange}
        //   hasCollapseButton
        //   onInlineCollapsedChange={(isCollapsed) => setCollapsed(isCollapsed)}
        //   onClick={onMenuClick}
        // />
        <Menu
          mode="inline"
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={onOpenChange}
          hasCollapseButton
          onInlineCollapsedChange={(isCollapsed) => setCollapsed(isCollapsed)}
          onClick={onMenuClick}
          className="sider-menu"
        >
          <SubMenu key="sub1" icon={<AppstoreOutlined />} title="规则集管理">
            <Menu.Item key="/rulesets">规则集</Menu.Item>
            <Menu.Item key="/logs">规则执行日志</Menu.Item>
          </SubMenu>
        </Menu>
      ) : (
        <div className="sider-menu center">尚未配置菜单权限</div>
      )}
    </Sider>
  );
};

export default LeftSider;
