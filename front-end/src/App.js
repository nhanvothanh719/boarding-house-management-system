import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <Router>
      <AppRouter/>
    </Router>
  );
}

export default App;
