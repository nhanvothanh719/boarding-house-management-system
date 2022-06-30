import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import NavBar from './common/NavBar';
import Footer from './common/Footer';

function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <AppRouter/>
    <Footer/>
    </BrowserRouter>
  );
}

export default App;
