// src/components/Generator/Generator.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaDice, FaLock, FaUnlock, FaMusic } from 'react-icons/fa';
import { Card, Subtitle, StyledTable, TableHeader, TableCell, ValueCell } from '../common/StyledComponents';
import { Icon } from '../../utils/IconHelper';

type LockedState = {
  root: boolean;
  scaleAndTones: boolean;
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
  max-width: 600px;
  margin: 0 auto;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
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

const TableRow = styled.tr`
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}11`};
  }
`;

const LockIconWrapper = styled.div<{ isLocked: boolean }>`
  cursor: pointer;
  color: ${({ isLocked, theme }) => 
    isLocked ? theme.colors.lockIconActive : theme.colors.lockIconInactive};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: scale(1.2);
  }
`;

const GeneratorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const GeneratorSubtitle = styled(Subtitle)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
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
    scaleAndTones: false,
    bpm: false,
    sound: false,
  });

  // Update localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('musicToolsRootEl', rootEl);
  }, [rootEl]);

  useEffect(() => {
    localStorage.setItem('musicToolsScaleEl', scaleEl);
  }, [scaleEl]);

  useEffect(() => {
    localStorage.setItem('musicToolsTonesEl', tonesEl);
  }, [tonesEl]);

  useEffect(() => {
    localStorage.setItem('musicToolsTonesArrEl', JSON.stringify(tonesArrEl));
  }, [tonesArrEl]);

  useEffect(() => {
    localStorage.setItem('musicToolsBpmEl', bpmEl);
  }, [bpmEl]);

  useEffect(() => {
    localStorage.setItem('musicToolsSoundEl', soundEl);
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
  }, [rootEl, scaleEl, setTonesArrEl, generateScaleTonesMemoized]);

  const maxBpm = 140;
  const minBpm = 75;

  const sounds = [
    "Guitar", "Bass", "Percussion", "Pad", "Synth", "Arp",
    "Acoustic", "Box", "Coin on strings", "FX", "Lead",
    "Fuzz", "Harmonics", "Ebox", "Freeze pedal", "Lap Steel",
    "Piano", "Violin", "Cello", "Banjo", "Whistle",
    "Birdsong", "Helicopter rotor", "Siren", "Space shuttle", "Alarm clock",
  ];

  const getRandomIndex = (n: number) => Math.floor(Math.random() * n);

  const rollDice = () => {
    setAnimate(false);

    // ROOT
    const newRoot = locked.root
      ? rootEl
      : roots[getRandomIndex(roots.length)];
    if (!locked.root) setRootEl(newRoot);

    // SCALE + original pattern
    const newScale = locked.scaleAndTones
      ? scaleEl
      : scales[getRandomIndex(scales.length)];
    if (!locked.scaleAndTones) {
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
      <GeneratorHeader>
        <GeneratorSubtitle>Inspiration Generator</GeneratorSubtitle>
      </GeneratorHeader>

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
              <LockIconWrapper isLocked={locked.root} onClick={() => toggleLock("root")}>
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
                isLocked={locked.scaleAndTones} 
                onClick={() => toggleLock("scaleAndTones")}
              >
                <IconWrapper>
                  {locked.scaleAndTones ? <Icon icon={FaLock} size={16} /> : <Icon icon={FaUnlock} size={16} />}
                </IconWrapper>
              </LockIconWrapper>
            </TableHeader>
            <TableCell>Scale</TableCell>
            <ValueCell>{scaleEl}</ValueCell>
          </TableRow>

          {/* original pattern */}
          <TableRow>
            <TableHeader />
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
              <LockIconWrapper isLocked={locked.bpm} onClick={() => toggleLock("bpm")}>
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
              <LockIconWrapper isLocked={locked.sound} onClick={() => toggleLock("sound")}>
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
