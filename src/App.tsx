import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ThemeProvider from './theme/ThemeProvider';
import { AppWrapper } from './components/common/StyledComponents';
import Nav from './components/Nav/Nav';
import CurrentProject from './pages/CurrentProject/CurrentProject';
import AboutPage from './pages/About/About';
import './App.css';

// Update the getBasename function
const getBasename = (): string => {
  // Check if we're on GitHub Pages
  const isGitHubPages = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1' && 
                        window.location.pathname.includes('/music-tools-studio');
  
  return isGitHubPages ? '/music-tools-studio' : '/';
};

export default function App(): JSX.Element {
  return (
    <ThemeProvider>
      <AppWrapper>
        <BrowserRouter basename={getBasename()}>
          <div className='navigation-menu'>
            <Nav />
          </div>
          <Routes>
            <Route path="/" element={<CurrentProject result="" />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/music-tools-studio" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppWrapper>
    </ThemeProvider>
  );
}
