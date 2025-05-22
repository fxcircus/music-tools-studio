import React, { FC, useState } from "react";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/StyledComponents';
import PomodoroTimer from "../../components/pomodoroTimer/pomodoroTimer";
import InspirationGenerator from "../../components/inspirationGenerator/inspirationGenerator";
import NotePad from "../../components/Notepad/Notepad";
import Metronome from "../../components/Metronome/Metronome";
import { MusicToolsState } from "../../utils/types";
import { loadAppState, saveAppState } from "../../utils/storageService";

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

const GridItem = styled(motion.div)<{ $order?: number }>`
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
  
  @media (max-width: 1024px) {
    order: ${({ $order }) => $order || 0};
  }
`;

const CurrentProject: FC<LoaderProps> = () => {
    const [state, setState] = useState<MusicToolsState>(loadAppState());
    const [animate, setAnimate] = useState(false);

    // Update state and save to localStorage whenever a component of state changes
    const updateState = (newState: Partial<MusicToolsState>) => {
        setState(prevState => {
            const updatedState = { ...prevState, ...newState };
            saveAppState(updatedState);
            return updatedState;
        });
    };

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
                <GridItem variants={itemVariants} $order={4}>
                    <PomodoroTimer />
                </GridItem>
                
                <GridItem variants={itemVariants} $order={1}>
                    <InspirationGenerator 
                        animate={animate}
                        setAnimate={setAnimate}
                        rootEl={state.rootEl}
                        setRootEl={(rootEl) => updateState({ rootEl })}
                        scaleEl={state.scaleEl}
                        setScaleEl={(scaleEl) => updateState({ scaleEl })}
                        tonesEl={state.tonesEl}
                        setTonesEl={(tonesEl) => updateState({ tonesEl })}
                        tonesArrEl={state.tonesArrEl}
                        setTonesArrEl={(tonesArrEl) => updateState({ tonesArrEl })}
                        bpmEl={state.bpmEl}
                        setBpmEl={(bpmEl) => updateState({ bpmEl })}
                        soundEl={state.soundEl}
                        setSoundEl={(soundEl) => updateState({ soundEl })}
                    />
                </GridItem>
                
                <GridItem variants={itemVariants} $order={3}>
                    <NotePad 
                        notes={state.notes} 
                        setNotes={(notes) => updateState({ notes })} 
                    />
                </GridItem>
                
                <GridItem variants={itemVariants} $order={2}>
                    <Metronome bpm={parseInt(state.bpmEl, 10)} />
                </GridItem>
            </TwoColumnGrid>
        </PageContainer>
    );
}

export default CurrentProject;
