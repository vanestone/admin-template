import type { SpinProps } from '@m-design/mui';
import { Spin } from '@m-design/mui';
import React from 'react';

const PageLoading: React.FC<SpinProps> = ({ ...reset }) => (
  <div style={{ paddingBlockStart: 100, textAlign: 'center' }}>
    <Spin size="large" {...reset} />
  </div>
);

export default PageLoading;
