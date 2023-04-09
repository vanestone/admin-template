import { Avatar, Dropdown, Space, Typography } from '@m-design/mui';
import React, { useState } from 'react';

const items = [
  { label: '修改密码', key: 'changePassword' },
  { label: '注销', key: 'logout' },
];

const UserInfo = () => {
  const userDisplayName = '师傅卡结婚甘家口华工科技阿豪跟';
  const [visible, setVisible] = useState(false);

  const handleMenuClick = async ({ key }) => {
    console.log(`🐛  key:`, key);
    // if (key === 'changePassword') {
    //   window.location = stringHelper.getSsoUrl('changePassword')
    // } else if (key === 'logout') {
    //   const [error] = await logout()
    //   if (!error) {
    //     window.location = stringHelper.getSsoUrl()
    //   }
    // }
    setVisible(false);
  };

  return (
    <Dropdown
      arrow
      open={visible}
      onOpenChange={setVisible}
      menu={{
        items,
        onClick: handleMenuClick,
      }}
    >
      <Space className="user-info">
        <Avatar className="avatar">{userDisplayName?.charAt(0)}</Avatar>
        <Typography.Text
          style={{ maxWidth: 130 }}
          ellipsis
          title={userDisplayName}
        >
          {userDisplayName}
        </Typography.Text>
      </Space>
    </Dropdown>
  );
};
export default UserInfo;
