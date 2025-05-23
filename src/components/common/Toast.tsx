import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Icon } from '../../utils/IconHelper';

interface ToastProps {
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
  isVisible: boolean;
}

const ToastContainer = styled(motion.div)<{ $type: string }>`
  position: fixed;
  top: 10px;
  right: 20px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme, $type }) => 
    $type === 'success' ? theme.colors.success :
    $type === 'error' ? theme.colors.error :
    theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  max-width: 300px;
`;

const MessageContainer = styled.div`
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const Toast: React.FC<ToastProps> = ({ 
  message, 
  duration = 3000, 
  type = 'success', 
  onClose,
  isVisible
}) => {
  const [visible, setVisible] = useState(isVisible);
  
  useEffect(() => {
    setVisible(isVisible);
    
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, isVisible, onClose]);
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <ToastContainer
          $type={type}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <MessageContainer>{message}</MessageContainer>
          <CloseButton onClick={handleClose} aria-label="Close">
            <Icon icon={FaTimes} size={16} />
          </CloseButton>
        </ToastContainer>
      )}
    </AnimatePresence>
  );
};

export default Toast; 