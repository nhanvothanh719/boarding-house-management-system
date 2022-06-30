import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import NavBar from './common/NavBar';
import Footer from './common/Footer';

function App() {
  return (
    <Router>
    <AppRouter/>
    <Footer/>
    </Router>
  );
}

export default App;
