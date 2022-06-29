import React from 'react';
import Header from './common/Header';
import Features from './components/HomePage/Features';
import TopBanner from './components/HomePage/TopBanner';
import WhyChooseUs from './components/HomePage/WhyChooseUs';
import Footer from './common/Footer';

function App() {
  return (
    <div>
      <Header/>
      <TopBanner/>
      <Features/>
      <WhyChooseUs/>
      <Footer/>
    </div>
  );
}

export default App;
