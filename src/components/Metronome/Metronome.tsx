import React, { FC, useEffect, useState, useRef, useCallback } from "react";
import styled from 'styled-components';
import { motion } from 'framer-motion';
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

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
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
  margin-top: ${({ theme }) => theme.spacing.xs};
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
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
    const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const beats = [0, 1, 2, 3]; // 4/4 time signature
    const prevBpmRef = useRef<number>(initialBpm);
    const isRestartingRef = useRef<boolean>(false);
    const externalBpmChangeRef = useRef<boolean>(false);
    
    // Web Audio API context
    const audioContextRef = useRef<AudioContext | null>(null);
    
    // Initialize audio context on first user interaction
    const initAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (error) {
                console.error("Failed to create AudioContext:", error);
            }
        } else if (audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume();
        }
    }, []);

    // Cleanup audio context on unmount
    useEffect(() => {
        return () => {
            clearAllTimers();
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
        };
    }, []);

    // Helper to clear all timers safely
    const clearAllTimers = useCallback(() => {
        if (intervalIdRef.current !== null) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
        
        if (timeoutIdRef.current !== null) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }
        
        if (restartTimeoutRef.current !== null) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = null;
        }
    }, []);

    // Create and play click sound
    const playClick = useCallback((isAccent: boolean) => {
        if (muteSound || !audioContextRef.current) return;
        
        try {
            // Create oscillator
            const oscillator = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();
            
            // Set properties based on whether this is an accented beat
            if (isAccent) {
                // Higher pitch for first beat
                oscillator.frequency.value = 880; // A5
                gainNode.gain.value = 0.5;
            } else {
                // Lower pitch for other beats
                oscillator.frequency.value = 440; // A4
                gainNode.gain.value = 0.3;
            }
            
            // Connect and start
            oscillator.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);
            
            // Quick envelope
            const now = audioContextRef.current.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(gainNode.gain.value, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            
            // Start and stop
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            
            // Clean up
            oscillator.onended = () => {
                oscillator.disconnect();
                gainNode.disconnect();
            };
        } catch (error) {
            console.error("Error playing click:", error);
        }
    }, [muteSound]);

    // Start the metronome interval with given BPM
    const startMetronomeInterval = useCallback((targetBpm: number) => {
        // Prevent multiple restarts
        if (isRestartingRef.current) return;
        isRestartingRef.current = true;
        
        // Ensure audio context is initialized
        initAudioContext();
        
        // Clear any existing timers first
        clearAllTimers();
        
        // Reset beat to 0
        setCurrentBeat(0);
        
        // Calculate interval time based on BPM
        const intervalTime = 60000 / targetBpm;
        
        // Add a longer delay if this was triggered by an external BPM change
        const delayTime = externalBpmChangeRef.current ? 250 : 100;
        
        // Add a delay before starting
        timeoutIdRef.current = setTimeout(() => {
            // Play the first beat
            playClick(true);
            
            // Set interval for subsequent beats
            intervalIdRef.current = setInterval(() => {
                setCurrentBeat(prev => {
                    const nextBeat = (prev + 1) % beats.length;
                    playClick(nextBeat === 0); // Accent on first beat
                    return nextBeat;
                });
            }, intervalTime);
            
            // Reset flags
            isRestartingRef.current = false;
            externalBpmChangeRef.current = false;
        }, delayTime);
    }, [beats.length, clearAllTimers, initAudioContext, playClick]);

    // Reset beat when BPM changes from outside (Inspiration Generator)
    useEffect(() => {
        if (initialBpm !== prevBpmRef.current) {
            console.log(`BPM changed from ${prevBpmRef.current} to ${initialBpm}`);
            setBpm(initialBpm);
            
            // If metronome is playing, handle the restart with a proper delay
            if (metronomePlaying) {
                // Flag that this was an external BPM change
                externalBpmChangeRef.current = true;
                
                // Stop the metronome first
                clearAllTimers();
                setCurrentBeat(0);
                
                // Wait a moment before restarting to ensure clean break
                restartTimeoutRef.current = setTimeout(() => {
                    startMetronomeInterval(initialBpm);
                }, 250);
            } else {
                // Just reset the beat if not playing
                setCurrentBeat(0);
            }
            
            prevBpmRef.current = initialBpm;
        }
    }, [initialBpm, metronomePlaying, startMetronomeInterval, clearAllTimers]);

    // Handle starting and stopping the metronome
    useEffect(() => {
        if (metronomePlaying) {
            // Don't start if we're waiting for a BPM change restart
            if (restartTimeoutRef.current === null) {
                // Initialize audio context and start metronome
                initAudioContext();
                startMetronomeInterval(bpm);
            }
        } else {
            // Stop and reset when metronome is turned off
            clearAllTimers();
            setCurrentBeat(0);
        }

        // Clean up on unmount or when dependencies change
        return clearAllTimers;
    }, [metronomePlaying, bpm, clearAllTimers, startMetronomeInterval, initAudioContext]);

    const handleIncreaseBpm = () => {
        initAudioContext(); // Ensure audio context is initialized on user interaction
        setBpm((prev: number) => {
            const newBpm = Math.min(prev + 1, 300);
            // Restart metronome if it's playing and BPM changed
            if (newBpm !== prev && metronomePlaying) {
                startMetronomeInterval(newBpm);
            }
            return newBpm;
        });
    };

    const handleDecreaseBpm = () => {
        initAudioContext(); // Ensure audio context is initialized on user interaction
        setBpm((prev: number) => {
            const newBpm = Math.max(prev - 1, 40);
            // Restart metronome if it's playing and BPM changed
            if (newBpm !== prev && metronomePlaying) {
                startMetronomeInterval(newBpm);
            }
            return newBpm;
        });
    };

    const toggleMetronome = () => {
        // Initialize audio context on user interaction
        initAudioContext();
        setMetronomePlaying(prev => !prev);
    };

    const toggleMute = () => {
        initAudioContext(); // Ensure audio context is initialized on user interaction
        setMuteSound(prev => !prev);
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
            
            <ControlsContainer>
                <PlayPauseButton 
                    onClick={toggleMetronome}
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                >
                    <IconWrapper>
                        {metronomePlaying ? <Icon icon={FaPause} size={24} /> : <Icon icon={FaPlay} size={24} />}
                    </IconWrapper>
                </PlayPauseButton>
                
                <ButtonGroup>
                    <ControlButton 
                        onClick={toggleMute}
                        whileHover={{ scale: 1.2 }} 
                        whileTap={{ scale: 0.9 }}
                    >
                        <IconWrapper>
                            {muteSound ? <Icon icon={FaVolumeMute} size={24} /> : <Icon icon={FaVolumeUp} size={24} />}
                        </IconWrapper>
                    </ControlButton>
                </ButtonGroup>
            </ControlsContainer>
            
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
