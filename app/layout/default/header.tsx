import React from 'react';
import UserInfo from './user-info';

const Header = () => {
  return (
    <div className="header-wrapper shadow-down">
      {/* 面包屑 或 其他功能 */}
      <div></div>
      <UserInfo />
    </div>
  );
};
export default Header;
