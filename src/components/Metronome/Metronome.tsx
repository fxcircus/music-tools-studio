import React, { FC, useEffect, useState, useRef, useCallback } from "react";
import * as Tone from 'tone';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaVolumeMute, FaVolumeUp, FaPlay, FaPause, FaPlus, FaMinus, FaDrum } from 'react-icons/fa';
import { Icon } from '../../utils/IconHelper';
import { Card, CardHeader, CardTitle, CardIconWrapper } from '../common/StyledComponents';

interface LoaderProps {
    bpm: number;
}

const MetronomeCard = styled(Card)`
  max-width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const MetronomeTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MetronomeDisplay = styled.div`
  width: 100%;
  position: relative;
  height: 150px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetronomePendulum = styled(motion.div)`
  width: 4px;
  height: 110px;
  background: ${({ theme }) => theme.colors.accentGradient};
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transform-origin: bottom center;
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const MetronomeBase = styled.div`
  width: 220px;
  height: 30px;
  background: ${({ theme }) => theme.colors.accentGradient};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  position: absolute;
  bottom: 0;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const BpmDisplay = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: 700;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  width: 100px;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const BpmLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ControlsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ControlButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  padding: ${({ theme }) => theme.spacing.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const PlayPauseButton = styled(ControlButton)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const BeatIndicator = styled(motion.div)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  margin: 0 ${({ theme }) => theme.spacing.xs};
`;

const BeatsRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const BpmControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Metronome: FC<LoaderProps> = ({ bpm: initialBpm }) => {
    const [metronomePlaying, setMetronomePlaying] = useState(false);
    const [muteSound, setMuteSound] = useState(false);
    const [bpm, setBpm] = useState(initialBpm);
    const [currentBeat, setCurrentBeat] = useState(0);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
    const beats = [0, 1, 2, 3]; // 4/4 time signature
    const synthRef = useRef<Tone.Synth | null>(null);

    // Create a memoized playSound function that doesn't change on re-renders
    const playSound = useCallback((beatToPlay: number) => {
        if (!synthRef.current) {
            // Create synth if it doesn't exist
            synthRef.current = new Tone.Synth({
                oscillator: {
                    type: 'triangle',
                },
                envelope: {
                    attack: 0.005,
                    decay: 0.1,
                    sustain: 0,
                    release: 0.1,
                },
            }).toDestination();
            
            // Adjust volume
            synthRef.current.volume.value = -20;
        }
        
        // Play different notes for the first beat vs others
        const now = Tone.now();
        if (beatToPlay === 0) {
            synthRef.current.triggerAttackRelease('C5', '16n', now);
        } else {
            synthRef.current.triggerAttackRelease('G4', '16n', now);
        }
    }, []);

    // Cleanup the synth on unmount
    useEffect(() => {
        return () => {
            if (synthRef.current) {
                synthRef.current.dispose();
                synthRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        setBpm(initialBpm);
    }, [initialBpm]);

    useEffect(() => {
        if (metronomePlaying) {
            // Initialize Tone.js context
            if (Tone.context.state !== 'running') {
                Tone.context.resume();
            }
            
            const intervalTime = 60000 / bpm; // Calculate interval time based on BPM
            
            // Clear previous interval if exists
            if (intervalIdRef.current !== null) {
                clearInterval(intervalIdRef.current);
            }
            
            intervalIdRef.current = setInterval(() => {
                if (!muteSound) {
                    playSound(currentBeat);
                }
                setCurrentBeat((prev) => (prev + 1) % beats.length);
            }, intervalTime);
        } else if (intervalIdRef.current !== null) {
            clearInterval(intervalIdRef.current);
        }

        return () => {
            if (intervalIdRef.current !== null) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [metronomePlaying, bpm, muteSound, beats.length, playSound, currentBeat]);

    const handleIncreaseBpm = () => {
        setBpm((prev: number) => Math.min(prev + 1, 300));
    };

    const handleDecreaseBpm = () => {
        setBpm((prev: number) => Math.max(prev - 1, 40));
    };

    return (
        <MetronomeCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <CardHeader>
                <CardIconWrapper>
                    <Icon icon={FaDrum} size={20} />
                </CardIconWrapper>
                <CardTitle>Metronome</CardTitle>
            </CardHeader>
            
            <MetronomeDisplay>
                <MetronomeBase />
                <MetronomePendulum 
                    animate={{ 
                        rotate: metronomePlaying ? [20, -20, 20] : 0
                    }}
                    transition={metronomePlaying ? { 
                        repeat: Infinity, 
                        duration: 60 / bpm, 
                        ease: "easeInOut" 
                    } : {}}
                />
            </MetronomeDisplay>
            
            <BpmControls>
                <ControlButton 
                    onClick={handleDecreaseBpm}
                    whileHover={{ scale: 1.2 }} 
                    whileTap={{ scale: 0.9 }}
                >
                    <IconWrapper>
                        <Icon icon={FaMinus} size={18} />
                    </IconWrapper>
                </ControlButton>
                
                <div>
                    <BpmDisplay>{bpm}</BpmDisplay>
                    <BpmLabel>BPM</BpmLabel>
                </div>
                
                <ControlButton 
                    onClick={handleIncreaseBpm}
                    whileHover={{ scale: 1.2 }} 
                    whileTap={{ scale: 0.9 }}
                >
                    <IconWrapper>
                        <Icon icon={FaPlus} size={18} />
                    </IconWrapper>
                </ControlButton>
            </BpmControls>
            
            <ControlsRow>
                <PlayPauseButton 
                    onClick={() => setMetronomePlaying(!metronomePlaying)}
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                >
                    <IconWrapper>
                        {metronomePlaying ? <Icon icon={FaPause} size={24} /> : <Icon icon={FaPlay} size={24} />}
                    </IconWrapper>
                </PlayPauseButton>
                
                <ControlButton 
                    onClick={() => setMuteSound(!muteSound)}
                    whileHover={{ scale: 1.2 }} 
                    whileTap={{ scale: 0.9 }}
                >
                    <IconWrapper>
                        {muteSound ? <Icon icon={FaVolumeMute} size={24} /> : <Icon icon={FaVolumeUp} size={24} />}
                    </IconWrapper>
                </ControlButton>
            </ControlsRow>
            
            <BeatsRow>
                {beats.map((beat) => (
                    <BeatIndicator 
                        key={beat}
                        animate={{ 
                            scale: currentBeat === beat && metronomePlaying ? [1, 1.5, 1] : 1,
                            backgroundColor: currentBeat === beat && metronomePlaying ? 
                                ['#6c63ff', '#5ee7df', '#6c63ff'] : '#6c63ff'
                        }}
                        transition={{ duration: 0.2 }}
                    />
                ))}
            </BeatsRow>
        </MetronomeCard>
    );
};

export default Metronome;
