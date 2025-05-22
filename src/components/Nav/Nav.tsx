import React, { FC } from "react";
import './Nav.css';
import { useNavigate } from 'react-router-dom';

const Nav: FC = () => {
  const navigate = useNavigate();

  const exportProject = () => {
    // Try to get values from localStorage if they exist
    let notes = '';
    let rootEl = 'C';
    let scaleEl = 'Major';
    let tonesEl = 'T - T - S - T - T - T - S';
    let bpmEl = '100';
    let soundEl = 'Guitar';
    
    // Get the notepad content from localStorage if it exists
    const savedNotes = localStorage.getItem('musicToolsNotes');
    if (savedNotes) {
      notes = savedNotes;
    }
    
    // Create project data object
    const currentProject = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      notes: notes,
      rootEl: rootEl,
      scaleEl: scaleEl,
      tonesEl: tonesEl,
      bpmEl: bpmEl,
      soundEl: soundEl
    };

    // Convert to JSON string
    const jsonData = JSON.stringify(currentProject, null, 2);
    
    // Create download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `music-project-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <nav className='nav-container'>
      <ul className='nav-items'>
        <li key="home" className="nav-item" onClick={() => navigate('/')}>Home</li>
        <li key="about" className="nav-item" onClick={() => navigate('/about')}>About</li>
        <li key="export" className="nav-item export-btn" onClick={exportProject}>Export</li>
      </ul>
    </nav>
  );
}

export default Nav;
