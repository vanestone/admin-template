import React, { useMemo } from 'react';
import LogoSVG from '@app/assets/imgs/logo.svg';
import { useNavigate } from 'react-router-dom';

type LogoProps = {
  collapsed: boolean;
  title: string;
};

const Logo = ({ collapsed, title }: LogoProps) => {
  const navigate = useNavigate();
  const goHome = () => navigate('/');

  const logoClass = useMemo(() => {
    return collapsed ? 'logo-title collapsed' : 'logo-title';
  }, [collapsed]);

  return (
    <div className="logo-box center" onClick={goHome}>
      <img src={LogoSVG} alt="logo" />
      <span className={logoClass}>{title}</span>
    </div>
  );
};

export default Logo;
