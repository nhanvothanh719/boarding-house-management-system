import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './common/Footer';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <Router>
      <AppRouter/>
    <Footer/>
    </Router>
  );
}

export default App;
