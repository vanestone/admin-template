import { Avatar, Dropdown, Space, Typography } from '@m-design/mui';
import React, { useEffect, useRef, useState } from 'react';
import { isTextEllipsis } from '../../utils';

const items = [
  { label: '修改密码', key: 'changePassword' },
  { label: '注销', key: 'logout' },
];

const UserInfo = () => {
  const userDisplayName = '师傅卡结婚甘家口华工科技阿豪跟';
  const [visible, setVisible] = useState(false);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

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

  // 检查文本是否被 ellipsis 截断
  useEffect(() => {
    const checkEllipsis = () => {
      if (textRef.current) {
        const isEllipsis = isTextEllipsis(textRef.current);
        setIsEllipsisActive(isEllipsis);
        console.log('文本是否被截断:', isEllipsis);
      }
    };

    // 初始检查
    checkEllipsis();

    // 监听窗口大小变化
    window.addEventListener('resize', checkEllipsis);
    return () => window.removeEventListener('resize', checkEllipsis);
  }, [userDisplayName]);

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
          ref={textRef}
          style={{ maxWidth: 130 }}
          ellipsis
          title={isEllipsisActive ? userDisplayName : undefined}
        >
          {userDisplayName}
        </Typography.Text>
      </Space>
    </Dropdown>
  );
};
export default UserInfo;
