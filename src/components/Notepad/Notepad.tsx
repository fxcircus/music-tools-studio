import React, { useEffect, useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, Title, TextArea } from '../common/StyledComponents';
import { FaStickyNote } from 'react-icons/fa';
import { Icon } from '../../utils/IconHelper';

interface NotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const NotesCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const NotepadHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const StyledTextArea = styled(TextArea)`
  min-height: 250px;
  font-family: 'Inter', 'Roboto', sans-serif;
  padding: ${({ theme }) => theme.spacing.md};
`;

export default function Notes({ notes, setNotes }: NotesProps) {
  const [text, setText] = useState<{ newText: string }>({ newText: '' });

  // Load notes from localStorage on component mount and when notes prop changes
  useEffect(() => {
    if (notes) {
      setText({ newText: notes });
    } else {
      const savedNotes = localStorage.getItem('musicToolsNotes');
      if (savedNotes) {
        setText({ newText: savedNotes });
        setNotes(savedNotes);
      }
    }
  }, [notes, setNotes]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setText({ ...text, [event.target.name]: newValue });
    setNotes(newValue);
    
    // Save to localStorage
    localStorage.setItem('musicToolsNotes', newValue);
  };

  return (
    <NotesCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <NotepadHeader>
        <IconWrapper>
          <Icon icon={FaStickyNote} size={20} />
        </IconWrapper>
        <Title>Notes</Title>
      </NotepadHeader>
      
      <StyledTextArea
        name="newText"
        onChange={handleChange}
        value={text.newText}
        placeholder="Write your musical ideas and notes here..."
      />
    </NotesCard>
  );
}
