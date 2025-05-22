// src/components/Generator/Generator.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaDice, FaLock, FaUnlock, FaMusic } from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardIconWrapper } from '../common/StyledComponents';
import { Icon } from '../../utils/IconHelper';

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
  padding: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
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
  margin: ${({ theme }) => theme.spacing.md} auto;
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const ScaleTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: 700;
  text-align: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
  background: ${({ theme }) => theme.colors.accentGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const TableRow = styled.tr`
  transition: all ${({ theme }) => theme.transitions.fast};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}11`};
  }
`;

const TableHeader = styled.td`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  width: 40px;
  text-align: center;
  vertical-align: middle;
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const ValueCell = styled.td`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  text-align: right;
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

  const rollDice = () => {
    setAnimate(false);

    // ROOT
    const newRoot = locked.root
      ? rootEl
      : roots[getRandomIndex(roots.length)];
    if (!locked.root) setRootEl(newRoot);

    // SCALE + original pattern
    const newScale = locked.scale
      ? scaleEl
      : scales[getRandomIndex(scales.length)];
    if (!locked.scale) {
      setScaleEl(newScale);
      setTonesEl(scalePatterns[newScale as keyof typeof scalePatterns]);
    }

    // COMPUTED scale tones with dashes/spaces
    const tonesArr = generateScaleTonesMemoized(newRoot, newScale);
    setComputedScaleNotes(tonesArr.join(" - "));
    setTonesArrEl(tonesArr);

    // SOUND
    if (!locked.sound) {
      setSoundEl(sounds[getRandomIndex(sounds.length)]);
    }

    // BPM
    if (!locked.bpm) {
      let bpmVal = getRandomIndex(maxBpm + 1);
      if (bpmVal < minBpm) bpmVal = minBpm;
      setBpmEl(bpmVal.toString());
    }

    setAnimate(true);
  };

  const toggleLock = (param: keyof LockedState) =>
    setLocked((s) => ({ ...s, [param]: !s[param] }));

  return (
    <InspirationCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CardHeader>
        <CardIconWrapper>
          <Icon icon={FaMusic} size={20} />
        </CardIconWrapper>
        <CardTitle>Inspiration Generator</CardTitle>
      </CardHeader>
      
      <ScaleTitle>{rootEl} {scaleEl}</ScaleTitle>
      
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
            <TableCell>Tones</TableCell>
            <ValueCell>{tonesEl}</ValueCell>
          </TableRow>

          {/* computed-note row */}
          <TableRow>
            <TableHeader />
            <TableCell>Scale Tones</TableCell>
            <ValueCell>{computedScaleNotes}</ValueCell>
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
            <ValueCell>{soundEl}</ValueCell>
          </TableRow>
        </tbody>
      </StyledTable>
    </InspirationCard>
  );
}
