import React from 'react';
import './config';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';
import AppContainer from './app-container';
import reportWebVitals from './reportWebVitals';
import {I18nextProvider} from "react-i18next";
import i18n from './i18n'

ReactDOM.render(
    <I18nextProvider i18n={i18n}><AppContainer /></I18nextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
