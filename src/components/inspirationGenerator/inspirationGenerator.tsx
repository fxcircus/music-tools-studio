// src/components/Generator/Generator.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaDice, FaLock, FaUnlock, FaMusic } from 'react-icons/fa';
import { Card, CardTitle, CardIconWrapper } from '../common/StyledComponents';
import { Icon } from '../../utils/IconHelper';

// Chord quality mapping for different modes
const chordQualities: Record<string, string[]> = {
  Major: ['', 'm', 'm', '', '', 'm', 'dim'],
  Minor: ['m', 'dim', '', 'm', 'm', '', ''],
  Dorian: ['m', 'm', '', '', 'm', 'dim', ''],
  Phrygian: ['m', '', '', 'm', 'dim', '', 'm'],
  Lydian: ['', '', 'm', 'dim', '', 'm', 'm'],
  Mixolydian: ['', 'm', 'dim', '', 'm', 'm', ''],
  Locrian: ['dim', '', 'm', 'm', '', 'm', '']
};

// Roman numeral for chord degrees
const romanNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

type LockedState = {
  root: boolean;
  scale: boolean;
  bpm: boolean;
  sound: boolean;
};

interface componentProps {
  animate: boolean;
  setAnimate: (animate: boolean) => void;
  rootEl: string;
  setRootEl: (rootEl: string) => void;
  scaleEl: string;
  setScaleEl: (scaleEl: string) => void;
  tonesEl: string;
  setTonesEl: (tonesEl: string) => void;
  tonesArrEl: string[];
  setTonesArrEl: (tonesArrEl: string[]) => void;
  bpmEl: string;
  setBpmEl: (bpmEl: string) => void;
  soundEl: string;
  setSoundEl: (soundEl: string) => void;
}

// Styled components
const InspirationCard = styled(Card)`
  max-width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  min-height: 400px;
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xs};
    min-height: 380px;
  }
`;

const DiceButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  margin: ${({ theme }) => theme.spacing.xs} auto;
  transition: all ${({ theme }) => theme.transitions.fast};
`;

// ScaleTitle component removed to save space

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: ${({ theme }) => theme.spacing.xs} 0;
  table-layout: fixed;
`;

const TableRow = styled.tr`
  transition: all ${({ theme }) => theme.transitions.fast};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  height: 36px;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}11`};
  }
  
  @media (max-width: 768px) {
    height: 32px; // Smaller height on mobile
  }
`;

const TableHeader = styled.td`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  width: 35px;
  text-align: center;
  vertical-align: middle;
  height: 100%;
  
  @media (max-width: 768px) {
    width: 30px; // Smaller width on mobile
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.xs}`}; // Smaller padding
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  width: 40%;
  vertical-align: middle;
  height: 100%;
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.xs}`}; // Smaller padding
    font-size: ${({ theme }) => theme.fontSizes.sm}; // Smaller font size
  }
`;

const ValueCell = styled.td`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  text-align: right;
  width: 50%; 
  white-space: nowrap;
  overflow: hidden;
  vertical-align: middle;
  height: 100%;
  
  // Dynamically adjust font size for long content
  &.long-content {
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
  
  &.very-long-content {
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.xs}`}; // Smaller padding
    font-size: ${({ theme }) => theme.fontSizes.sm}; // Smaller font size by default on mobile
    
    &.long-content, &.very-long-content {
      font-size: ${({ theme }) => theme.fontSizes.xs}; // Even smaller for long content
    }
  }
`;

const LockIconWrapper = styled.div<{ $isLocked: boolean }>`
  cursor: pointer;
  color: ${({ $isLocked, theme }) => 
    $isLocked ? theme.colors.lockIconActive : theme.colors.lockIconInactive};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: scale(1.2);
  }
`;

const GeneratorSubtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SubtitleText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const InspirationCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ChordDegreeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${({ theme }) => theme.spacing.xs} 0;
  width: 100%;
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  
  @media (max-width: 768px) {
    justify-content: flex-start; // Left align on mobile
    gap: ${({ theme }) => theme.spacing.xs}; // Smaller gaps on mobile
  }
`;

const ChordDegree = styled.div<{ $isSelected: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primary : `${theme.colors.primary}22`};
  color: ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.buttonText : theme.colors.text};
  font-weight: 600;
  min-width: 40px;
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin: 0 ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.small};
  }
  
  @media (max-width: 768px) {
    min-width: 30px; // Smaller min-width on mobile
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.xs}`}; // Smaller padding
    margin: 0; // Remove margin on mobile (using gap instead)
  }
`;

const ChordName = styled.div<{ $isSelected: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primary : theme.colors.textSecondary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ $isSelected }) => ($isSelected ? '600' : '400')};
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.xs}; // Smaller font on mobile
  }
`;

const ScaleTonesRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${({ theme }) => theme.spacing.xs} 0;
  width: 100%;
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  
  @media (max-width: 768px) {
    justify-content: flex-start; // Left align on mobile
    gap: ${({ theme }) => theme.spacing.xs}; // Smaller gaps on mobile
  }
`;

const ScaleToneNote = styled.div<{ $highlight: 'root' | 'chord' | 'none' }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ $highlight, theme }) => 
    $highlight === 'root' 
      ? theme.colors.primary 
      : $highlight === 'chord' 
        ? `${theme.colors.secondary}88` 
        : `${theme.colors.primary}22`};
  color: ${({ $highlight, theme }) => 
    $highlight === 'root' || $highlight === 'chord'
      ? theme.colors.buttonText 
      : theme.colors.text};
  font-weight: 500;
  min-width: 40px;
  text-align: center;
  margin: 0 ${({ theme }) => theme.spacing.xs};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  @media (max-width: 768px) {
    min-width: 30px; // Smaller min-width on mobile
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.xs}`}; // Smaller padding
    margin: 0; // Remove margin on mobile (using gap instead)
  }
`;

const SectionTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: ${({ theme }) => theme.spacing.xs} 0 ${({ theme }) => theme.spacing.xs};
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.sm}; // Smaller font on mobile
    margin-top: ${({ theme }) => theme.spacing.xs}; // Tighter spacing
  }
`;

export default function InspirationGenerator({
  animate,
  setAnimate,
  rootEl,
  setRootEl,
  scaleEl,
  setScaleEl,
  tonesEl,
  setTonesEl,
  tonesArrEl,
  setTonesArrEl,
  bpmEl,
  setBpmEl,
  soundEl,
  setSoundEl,
}: componentProps) {
  const [locked, setLocked] = useState<LockedState>({
    root: false,
    scale: false,
    bpm: false,
    sound: false,
  });
  
  // Add state for selected chord
  const [selectedChord, setSelectedChord] = useState<number | null>(null);

  // Update localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('tilesRootEl', rootEl);
  }, [rootEl]);

  useEffect(() => {
    localStorage.setItem('tilesScaleEl', scaleEl);
  }, [scaleEl]);

  useEffect(() => {
    localStorage.setItem('tilesTonesEl', tonesEl);
  }, [tonesEl]);

  useEffect(() => {
    localStorage.setItem('tilesTonesArrEl', JSON.stringify(tonesArrEl));
  }, [tonesArrEl]);

  useEffect(() => {
    localStorage.setItem('tilesBpmEl', bpmEl);
  }, [bpmEl]);

  useEffect(() => {
    localStorage.setItem('tilesSoundEl', soundEl);
  }, [soundEl]);

  // 12 chromatic notes (using Unicode ♯)
  const notes = useMemo(() => [
    "C", "C♯", "D", "D♯", "E", "F",
    "F♯", "G", "G♯", "A", "A♯", "B",
  ], []);
  
  const roots = notes;

  const scales = useMemo(() => [
    "Major",
    "Minor",
    "Dorian",
    "Phrygian",
    "Lydian",
    "Mixolydian",
    "Locrian",
  ], []);

  // your original pattern text for the "Tones" row
  const scalePatterns = useMemo<Record<string, string>>(() => ({
    Major:      "T - T - S - T - T - T - S",
    Minor:      "T - S - T - T - S - T - T",
    Dorian:     "T - S - T - T - T - S - T",
    Phrygian:   "S - T - T - T - S - T - T",
    Lydian:     "T - T - T - S - T - T - S",
    Mixolydian: "T - T - S - T - T - S - T",
    Locrian:    "S - T - T - S - T - T - T",
  }), []);

  // semitone steps for computing actual notes
  const scaleIntervals = useMemo<Record<string, number[]>>(() => ({
    Major:      [2, 2, 1, 2, 2, 2, 1],
    Minor:      [2, 1, 2, 2, 1, 2, 2],
    Dorian:     [2, 1, 2, 2, 2, 1, 2],
    Phrygian:   [1, 2, 2, 2, 1, 2, 2],
    Lydian:     [2, 2, 2, 1, 2, 2, 1],
    Mixolydian: [2, 2, 1, 2, 2, 1, 2],
    Locrian:    [1, 2, 2, 1, 2, 2, 2],
  }), []);

  // Memoize the function to avoid recreation on each render
  const generateScaleTonesMemoized = useCallback(
    (root: string, mode: string): string[] => {
      // Only process valid modes that exist in our scale intervals
      if (mode in scaleIntervals) {
        const intervals = scaleIntervals[mode as keyof typeof scaleIntervals];
        let idx = notes.indexOf(root);
        const result = [root];
        for (let step of intervals) {
          idx = (idx + step) % notes.length;
          result.push(notes[idx]);
        }
        return result;
      }
      // Fallback to C Major if mode is invalid
      return ["C", "D", "E", "F", "G", "A", "B", "C"];
    },
    [notes, scaleIntervals]
  );

  // initialize to C Major
  const initialScaleTones = useMemo(() => 
    generateScaleTonesMemoized("C", "Major").join(" - "),
  [generateScaleTonesMemoized]);
  
  const [computedScaleNotes, setComputedScaleNotes] = useState<string>(
    initialScaleTones
  );

  // Update computed scale tones whenever root or scale changes
  useEffect(() => {
    const tonesArr = generateScaleTonesMemoized(rootEl, scaleEl);
    setComputedScaleNotes(tonesArr.join(" - "));
    setTonesArrEl(tonesArr);
  }, [rootEl, scaleEl, generateScaleTonesMemoized]);

  const maxBpm = 140;
  const minBpm = 75;

  
  const sounds = ["Electric Guitar", "Deep Bass", "Percussion", "Arp", "Acoustic Strums", "Coin-on-Strings", "Lead", "Fuzzy", "Glass Harmonics", "E-Bow Drones", "Frozen Reverb", "Slide Guitar", "Cinematic Piano", "Bow", "Banjo", "Whistling Melody"];

  const getRandomIndex = (n: number) => Math.floor(Math.random() * n);

  const getRandomValueDifferentFromCurrent = (array: string[], current: string): string => {
    if (array.length <= 1) return current; // If only one option, we can't change
    
    let newValue;
    do {
      newValue = array[getRandomIndex(array.length)];
    } while (newValue === current && array.length > 1);
    
    return newValue;
  };
  
  const getRandomBpmDifferentFromCurrent = (min: number, max: number, current: string): string => {
    if (max - min <= 1) return current; // If only one option, we can't change
    
    const currentBpm = parseInt(current);
    let newBpm;
    
    do {
      newBpm = getRandomIndex(max + 1);
      if (newBpm < min) newBpm = min;
    } while (newBpm === currentBpm && max - min > 1);
    
    return newBpm.toString();
  };

  const rollDice = () => {
    setAnimate(false);

    // ROOT
    if (!locked.root) {
      const newRoot = getRandomValueDifferentFromCurrent(roots, rootEl);
      setRootEl(newRoot);
    }

    // SCALE + original pattern
    if (!locked.scale) {
      const newScale = getRandomValueDifferentFromCurrent(scales, scaleEl);
      setScaleEl(newScale);
      setTonesEl(scalePatterns[newScale as keyof typeof scalePatterns]);
    }

    // COMPUTED scale tones with dashes/spaces
    const newRoot = locked.root ? rootEl : getRandomValueDifferentFromCurrent(roots, rootEl);
    const newScale = locked.scale ? scaleEl : getRandomValueDifferentFromCurrent(scales, scaleEl);
    const tonesArr = generateScaleTonesMemoized(newRoot, newScale);
    setComputedScaleNotes(tonesArr.join(" - "));
    setTonesArrEl(tonesArr);

    // SOUND
    if (!locked.sound) {
      const newSound = getRandomValueDifferentFromCurrent(sounds, soundEl);
      setSoundEl(newSound);
    }

    // BPM
    if (!locked.bpm) {
      const newBpm = getRandomBpmDifferentFromCurrent(minBpm, maxBpm, bpmEl);
      setBpmEl(newBpm);
    }

    setAnimate(true);
  };

  const toggleLock = (param: keyof LockedState) =>
    setLocked((s) => ({ ...s, [param]: !s[param] }));

  const getValueCellClass = (value: string): string => {
    if (value.length > 30) return 'very-long-content';
    if (value.length > 20) return 'long-content';
    return '';
  };

  // Build chord names based on current root and scale
  const getChordNames = () => {
    if (!rootEl || !scaleEl || !tonesArrEl || tonesArrEl.length < 7) {
      return ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'];
    }

    const qualities = chordQualities[scaleEl as keyof typeof chordQualities] || chordQualities.Major;
    
    return tonesArrEl.slice(0, 7).map((note, index) => {
      return `${note}${qualities[index]}`;
    });
  };

  // Get highlighted notes based on selected chord
  const getHighlightType = (noteIndex: number): 'root' | 'chord' | 'none' => {
    if (selectedChord === null) return 'none';
    
    // In a 7-note scale with triads (1-3-5):
    // Root is the chord position
    if (noteIndex === selectedChord) return 'root';
    
    // Third is 2 steps up (wrapping around if needed)
    const thirdPosition = (selectedChord + 2) % 7;
    // Fifth is 4 steps up (wrapping around if needed)
    const fifthPosition = (selectedChord + 4) % 7;
    
    if (noteIndex === thirdPosition || noteIndex === fifthPosition) {
      return 'chord';
    }
    
    return 'none';
  };

  // Handle chord selection
  const handleChordClick = (chordIndex: number) => {
    // If clicking the same chord, toggle it off
    if (selectedChord === chordIndex) {
      setSelectedChord(null);
    } else {
      setSelectedChord(chordIndex);
    }
  };

  return (
    <InspirationCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <InspirationCardHeader>
        <CardIconWrapper>
          <Icon icon={FaMusic} size={20} />
        </CardIconWrapper>
        <CardTitle>Inspiration Generator</CardTitle>
      </InspirationCardHeader>
      
      <DiceButton
        whileHover={{ rotate: 12, scale: 1.1 }}
        whileTap={{ rotate: 360, scale: 0.9 }}
        onClick={rollDice}
        animate={animate ? { rotate: [0, 360], scale: [1, 1.2, 1] } : {}}
        transition={animate ? { duration: 0.5, ease: "easeOut" } : {}}
      >
        <IconWrapper><Icon icon={FaDice} size={24} /></IconWrapper>
      </DiceButton>

      <StyledTable>
        <tbody>
          <TableRow>
            <TableHeader>
              <LockIconWrapper 
                $isLocked={locked.root} 
                onClick={() => toggleLock("root")}
              >
                <IconWrapper>
                  {locked.root ? <Icon icon={FaLock} size={16} /> : <Icon icon={FaUnlock} size={16} />}
                </IconWrapper>
              </LockIconWrapper>
            </TableHeader>
            <TableCell>Root</TableCell>
            <ValueCell>{rootEl}</ValueCell>
          </TableRow>
          
          <TableRow>
            <TableHeader>
              <LockIconWrapper 
                $isLocked={locked.scale} 
                onClick={() => toggleLock("scale")}
              >
                <IconWrapper>
                  {locked.scale ? <Icon icon={FaLock} size={16} /> : <Icon icon={FaUnlock} size={16} />}
                </IconWrapper>
              </LockIconWrapper>
            </TableHeader>
            <TableCell>Scale</TableCell>
            <ValueCell>{scaleEl}</ValueCell>
          </TableRow>

          <TableRow>
            <TableHeader></TableHeader>
            <TableCell>Intervals</TableCell>
            <ValueCell>{tonesEl}</ValueCell>
          </TableRow>

          <TableRow>
            <TableHeader>
              <LockIconWrapper $isLocked={locked.bpm} onClick={() => toggleLock("bpm")}>
                <IconWrapper>
                  {locked.bpm ? <Icon icon={FaLock} size={16} /> : <Icon icon={FaUnlock} size={16} />}
                </IconWrapper>
              </LockIconWrapper>
            </TableHeader>
            <TableCell>BPM</TableCell>
            <ValueCell>{bpmEl}</ValueCell>
          </TableRow>

          <TableRow>
            <TableHeader>
              <LockIconWrapper $isLocked={locked.sound} onClick={() => toggleLock("sound")}>
                <IconWrapper>
                  {locked.sound ? <Icon icon={FaLock} size={16} /> : <Icon icon={FaUnlock} size={16} />}
                </IconWrapper>
              </LockIconWrapper>
            </TableHeader>
            <TableCell>Sound</TableCell>
            <ValueCell className={getValueCellClass(soundEl)}>{soundEl}</ValueCell>
          </TableRow>
        </tbody>
      </StyledTable>
      
      {/* Add Chord Degrees section */}
      <SectionTitle>Chord Degrees</SectionTitle>
      <ChordDegreeContainer>
        {romanNumerals.map((numeral, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ChordDegree 
              $isSelected={selectedChord === index}
              onClick={() => handleChordClick(index)}
            >
              {numeral}
            </ChordDegree>
            <ChordName $isSelected={selectedChord === index}>
              {getChordNames()[index]}
            </ChordName>
          </div>
        ))}
      </ChordDegreeContainer>
      
      {/* Add Scale Tones visualization */}
      <SectionTitle>Scale Tones</SectionTitle>
      <ScaleTonesRow>
        {tonesArrEl.slice(0, 8).map((note, index) => (
          <ScaleToneNote 
            key={index}
            $highlight={index < 7 ? getHighlightType(index) : 'none'}
          >
            {note}
          </ScaleToneNote>
        ))}
      </ScaleTonesRow>
    </InspirationCard>
  );
}
