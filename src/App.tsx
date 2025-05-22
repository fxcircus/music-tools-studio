import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav/Nav'
import CurrentProject from './pages/CurrentProject/CurrentProject';
import AboutPage from './pages/About/About';

export default function App(): any  {
  return (
    <BrowserRouter>
      <div className='navigation-menu'>
        <Nav />
      </div>
      <Routes>
        <Route path="/" element={<CurrentProject result="" />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
