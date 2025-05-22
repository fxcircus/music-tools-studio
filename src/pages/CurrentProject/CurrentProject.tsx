import React, { FC, useState, useEffect } from "react";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/StyledComponents';
import PomodoroTimer from "../../components/pomodoroTimer/pomodoroTimer";
import InspirationGenerator from "../../components/inspirationGenerator/inspirationGenerator";
import NotePad from "../../components/Notepad/Notepad";
import Metronome from "../../components/Metronome/Metronome";

interface LoaderProps {
    result?: string;
}

const PageContainer = styled(Container)`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.xxl}`};
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.xl}`};
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const GridItem = styled(motion.div)`
  height: 100%;
  display: flex;
  
  & > * {
    flex: 1;
    width: 100%;
    margin-top: ${({ theme }) => theme.spacing.md};
    
    @media (max-width: 768px) {
      margin-top: ${({ theme }) => theme.spacing.sm};
    }
  }
`;

const CurrentProject: FC<LoaderProps> = () => {
    const [notes, setNotes] = useState<string>('');
    const [animate, setAnimate] = useState(false);
    const [rootEl, setRootEl] = useState("C");
    const [scaleEl, setScaleEl] = useState("Major");
    const [tonesEl, setTonesEl] = useState("T - T - S - T - T - T - S");
    const [tonesArrEl, setTonesArrEl] = useState<string[]>(["C", "D", "E", "F", "G", "A", "B", "C"]);
    const [bpmEl, setBpmEl] = useState("100");
    const [soundEl, setSoundEl] = useState("Guitar");

    useEffect(() => {
        // Load all values from localStorage when component mounts
        const savedNotes = localStorage.getItem('musicToolsNotes');
        if (savedNotes) {
            setNotes(savedNotes);
        }
        
        const savedRootEl = localStorage.getItem('musicToolsRootEl');
        if (savedRootEl) {
            setRootEl(savedRootEl);
        }
        
        const savedScaleEl = localStorage.getItem('musicToolsScaleEl');
        if (savedScaleEl) {
            setScaleEl(savedScaleEl);
        }
        
        const savedTonesEl = localStorage.getItem('musicToolsTonesEl');
        if (savedTonesEl) {
            setTonesEl(savedTonesEl);
        }
        
        const savedTonesArrEl = localStorage.getItem('musicToolsTonesArrEl');
        if (savedTonesArrEl) {
            try {
                setTonesArrEl(JSON.parse(savedTonesArrEl));
            } catch (error) {
                console.error("Error parsing tonesArrEl from localStorage:", error);
            }
        }
        
        const savedBpmEl = localStorage.getItem('musicToolsBpmEl');
        if (savedBpmEl) {
            setBpmEl(savedBpmEl);
        }
        
        const savedSoundEl = localStorage.getItem('musicToolsSoundEl');
        if (savedSoundEl) {
            setSoundEl(savedSoundEl);
        }
    }, []);

    // Component variants for animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <PageContainer as={motion.div} 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <TwoColumnGrid>
                <GridItem variants={itemVariants}>
                    <PomodoroTimer />
                </GridItem>
                
                <GridItem variants={itemVariants}>
                    <InspirationGenerator 
                        animate={animate}   setAnimate={setAnimate}
                        rootEl={rootEl}     setRootEl={setRootEl}
                        scaleEl={scaleEl}   setScaleEl={setScaleEl}
                        tonesEl={tonesEl}   setTonesEl={setTonesEl}
                        tonesArrEl={tonesArrEl} setTonesArrEl={setTonesArrEl}
                        bpmEl={bpmEl}       setBpmEl={setBpmEl}
                        soundEl={soundEl}   setSoundEl={setSoundEl}
                    />
                </GridItem>
                
                <GridItem variants={itemVariants}>
                    <NotePad notes={notes} setNotes={setNotes} />
                </GridItem>
                
                <GridItem variants={itemVariants}>
                    <Metronome bpm={parseInt(bpmEl, 10)} />
                </GridItem>
            </TwoColumnGrid>
        </PageContainer>
    );
}

export default CurrentProject;
