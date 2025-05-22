import React, { FC, useState, useRef } from "react";
import './Nav.css';
import { useNavigate } from 'react-router-dom';

interface Project {
  notes: string;
  rootEl: string;
  scaleEl: string;
  tonesEl: string;
  tonesArrEl: string[];
  bpmEl: string;
  soundEl: string;
}

const Nav: FC = () => {
  const navigate = useNavigate();
  const [showImportModal, setShowImportModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const exportProject = () => {
    // Try to get values from localStorage if they exist
    let notes = localStorage.getItem('musicToolsNotes') || '';
    let rootEl = localStorage.getItem('musicToolsRootEl') || 'C';
    let scaleEl = localStorage.getItem('musicToolsScaleEl') || 'Major';
    let tonesEl = localStorage.getItem('musicToolsTonesEl') || 'T - T - S - T - T - T - S';
    
    // Parse tonesArrEl from localStorage or use default
    let tonesArrEl;
    try {
      const savedTonesArrEl = localStorage.getItem('musicToolsTonesArrEl');
      tonesArrEl = savedTonesArrEl ? JSON.parse(savedTonesArrEl) : ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
    } catch (error) {
      console.error("Error parsing tonesArrEl:", error);
      tonesArrEl = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
    }
    
    let bpmEl = localStorage.getItem('musicToolsBpmEl') || '100';
    let soundEl = localStorage.getItem('musicToolsSoundEl') || 'Guitar';
    
    console.log("Exporting with values from localStorage:");
    console.log("Root:", rootEl);
    console.log("Scale:", scaleEl);
    console.log("Tones:", tonesEl);
    console.log("TonesArr:", tonesArrEl);
    console.log("BPM:", bpmEl);
    console.log("Sound:", soundEl);
    
    // Create project data object
    const currentProject = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      notes,
      rootEl,
      scaleEl,
      tonesEl,
      tonesArrEl,
      bpmEl,
      soundEl
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

  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const handleCloseModal = () => {
    setShowImportModal(false);
    setDragActive(false);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const jsonData = JSON.parse(result) as Project;
          
          // Save all project data to localStorage
          localStorage.setItem('musicToolsNotes', jsonData.notes || '');
          localStorage.setItem('musicToolsRootEl', jsonData.rootEl || 'C');
          localStorage.setItem('musicToolsScaleEl', jsonData.scaleEl || 'Major');
          localStorage.setItem('musicToolsTonesEl', jsonData.tonesEl || 'T - T - S - T - T - T - S');
          localStorage.setItem('musicToolsTonesArrEl', JSON.stringify(jsonData.tonesArrEl || ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C']));
          localStorage.setItem('musicToolsBpmEl', jsonData.bpmEl || '100');
          localStorage.setItem('musicToolsSoundEl', jsonData.soundEl || 'Guitar');
          
          // Close the modal
          setShowImportModal(false);
          
          // Force page reload to ensure everything is updated
          window.location.reload();
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Invalid JSON file. Please try again.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <nav className='nav-container'>
      <ul className='nav-items'>
        <li key="home" className="nav-item" onClick={() => navigate('/')}>Home</li>
        <li key="about" className="nav-item" onClick={() => navigate('/about')}>About</li>
        <li key="import" className="nav-item import-btn" onClick={handleImportClick}>Import</li>
        <li key="export" className="nav-item export-btn" onClick={exportProject}>Export</li>
      </ul>

      {showImportModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="modal-header">
              <h3>Import Project</h3>
              <button className="close-button" onClick={handleCloseModal}>&times;</button>
            </div>
            <div className={`drop-area ${dragActive ? "drag-active" : ""}`}>
              <p>Drag & drop your project file here, or</p>
              <button className="file-button" onClick={handleButtonClick}>
                Choose File
              </button>
              <input
                ref={inputRef}
                type="file"
                className="input-field"
                accept=".json"
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
