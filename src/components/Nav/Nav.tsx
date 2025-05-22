import React, { FC, useState, useRef } from "react";
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeProvider';
import { FaSun, FaMoon, FaFileImport, FaFileExport, FaTimes } from 'react-icons/fa';
import { Icon } from '../../utils/IconHelper';

interface Project {
  notes: string;
  rootEl: string;
  scaleEl: string;
  tonesEl: string;
  tonesArrEl: string[];
  bpmEl: string;
  soundEl: string;
}

// Styled components
const NavContainer = styled.nav`
  background-color: ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: ${({ theme }) => theme.spacing.md};
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
  transition: all ${({ theme }) => theme.transitions.normal};
`;

const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavBrand = styled(motion.div)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  background: ${({ theme }) => theme.colors.accentGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NavItems = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled(motion.li)<{ active?: boolean }>`
  position: relative;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text};

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: ${({ active }) => active ? '100%' : '0'};
    height: 2px;
    background: ${({ theme }) => theme.colors.accentGradient};
    transition: width ${({ theme }) => theme.transitions.normal};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    
    &::after {
      width: 100%;
    }
  }
`;

const ImportExportGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.accentGradient};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ThemeToggleButton = styled(motion.button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: ${({ theme }) => theme.spacing.xs};
  margin-left: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  border-radius: ${({ theme }) => theme.borderRadius.round};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => `${theme.colors.primary}11`};
  }
`;

// Modal styled components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.large};
  width: 90%;
  max-width: 500px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.error};
    transform: rotate(90deg);
  }
`;

const DropArea = styled.div<{ isDragActive: boolean }>`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 2px dashed ${({ isDragActive, theme }) => 
    isDragActive ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  background-color: ${({ isDragActive, theme }) => 
    isDragActive ? `${theme.colors.primary}11` : 'transparent'};
`;

const FileButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.colors.primary};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

// Animation variants
const modalVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 50, transition: { duration: 0.2 } }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Nav: FC = () => {
  const navigate = useNavigate();
  const [showImportModal, setShowImportModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode, toggleTheme } = useTheme();

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
    <NavContainer>
      <NavInner>
        <NavBrand
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span 
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, -10, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            🎵
          </motion.span>
          Music Tools
        </NavBrand>
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <NavItems>
            <NavItem 
              active={true} 
              whileHover={{ scale: 1.05 }} 
              onClick={() => navigate('/')}
            >
              Project
            </NavItem>
            <NavItem 
              whileHover={{ scale: 1.05 }} 
              onClick={() => navigate('/about')}
            >
              About
            </NavItem>
          </NavItems>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <ImportExportGroup>
            <ActionButton 
              onClick={exportProject}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Export Project"
            >
              <IconWrapper>
                <Icon icon={FaFileExport} size={16} />
              </IconWrapper>
              Export
            </ActionButton>
            
            <ActionButton 
              onClick={handleImportClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Import Project"
            >
              <IconWrapper>
                <Icon icon={FaFileImport} size={16} />
              </IconWrapper>
              Import
            </ActionButton>
          </ImportExportGroup>
          
          <ThemeToggleButton 
            onClick={toggleTheme}
            whileHover={{ rotate: 12, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <IconWrapper>
              {isDarkMode ? <Icon icon={FaMoon} size={20} /> : <Icon icon={FaSun} size={20} />}
            </IconWrapper>
          </ThemeToggleButton>
        </motion.div>
      </NavInner>

      <AnimatePresence>
        {showImportModal && (
          <ModalOverlay 
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={handleCloseModal}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <ModalHeader>
                <ModalTitle>Import Project</ModalTitle>
                              <CloseButton onClick={handleCloseModal}>
                <IconWrapper>
                  <Icon icon={FaTimes} size={20} />
                </IconWrapper>
              </CloseButton>
              </ModalHeader>
              
              <DropArea 
                isDragActive={dragActive}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <p>Drag & drop your project file here</p>
                
                <FileButton 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={handleButtonClick}
                >
                  Choose File
                </FileButton>
                
                <input
                  ref={inputRef}
                  type="file"
                  accept=".json"
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </DropArea>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </NavContainer>
  );
}

export default Nav;
