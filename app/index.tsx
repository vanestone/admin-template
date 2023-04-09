import React from 'react';
import ReactDOM from 'react-dom';
import App from '@app/provider';
import '@m-design/mui/dist/mui.less';
import '@app/assets/styles/global.less';

const contaner = document.getElementById('root');
ReactDOM.render(<App />, contaner);
