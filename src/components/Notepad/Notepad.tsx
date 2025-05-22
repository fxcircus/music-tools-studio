import React, { useEffect, useState, ChangeEvent } from 'react';
import "./Notepad.css"

interface NotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export default function Notes({ notes, setNotes }: NotesProps) {
  const [text, setText] = useState<{ newText: string }>({ newText: '' });

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('musicToolsNotes');
    if (savedNotes) {
      setText({ newText: savedNotes });
      setNotes(savedNotes);
    } else if (notes) {
      setText({ newText: notes });
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setText({ ...text, [event.target.name]: newValue });
    setNotes(newValue);
    
    // Save to localStorage
    localStorage.setItem('musicToolsNotes', newValue);
  };

  return (
    <div className='notepad'>
      <h3>Notes</h3>
      <textarea
        name="newText"
        onChange={handleChange}
        value={text.newText}
        rows={20}
        cols={110}
      />
    </div>
  );
}
