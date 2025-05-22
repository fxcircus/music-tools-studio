import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Card, CardHeader, CardTitle, CardIconWrapper } from './StyledComponents';
import { Icon } from '../../utils/IconHelper';
import { IconType } from 'react-icons';

interface ToolCardProps {
  title: string;
  icon: IconType;
  children: ReactNode;
  className?: string;
}

const StyledToolCard = styled(Card)`
  max-width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

/**
 * Reusable component for tool cards with consistent styling and animations
 */
const ToolCard: React.FC<ToolCardProps> = ({ title, icon, children, className }) => {
  return (
    <StyledToolCard 
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader>
        <CardIconWrapper>
          <Icon icon={icon} size={20} />
        </CardIconWrapper>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      
      {children}
    </StyledToolCard>
  );
};

export default ToolCard; 