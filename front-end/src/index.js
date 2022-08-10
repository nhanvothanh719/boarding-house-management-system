import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';


//Set base URL
axios.defaults.baseURL = 'http://127.0.0.1:8000/api';
//Set Bearer token to route
//axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('auth_token');
//CSRF protection
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//Accept JSON
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();