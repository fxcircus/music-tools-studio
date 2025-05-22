import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThemeProvider from './theme/ThemeProvider';
import { AppWrapper } from './components/common/StyledComponents';
import Nav from './components/Nav/Nav';
import CurrentProject from './pages/CurrentProject/CurrentProject';
import AboutPage from './pages/About/About';
import './App.css';

export default function App(): JSX.Element {
  return (
    <ThemeProvider>
      <AppWrapper>
        <BrowserRouter>
          <div className='navigation-menu'>
            <Nav />
          </div>
          <Routes>
            <Route path="/" element={<CurrentProject result="" />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </BrowserRouter>
      </AppWrapper>
    </ThemeProvider>
  );
}
