// src/components/Generator/Generator.tsx

import React, { useState } from "react";
import "./inspirationGenerator.css";
import Metronome from "../Metronome/Metronome";

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
  bpmEl: string;
  setBpmEl: (bpmEl: string) => void;
  soundEl: string;
  setSoundEl: (soundEl: string) => void;
}

export default function InspirationGenerator({
  animate,
  setAnimate,
  rootEl,
  setRootEl,
  scaleEl,
  setScaleEl,
  tonesEl,
  setTonesEl,
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

  // 12 chromatic notes (using Unicode ♯)
  const notes = [
    "C", "C♯", "D", "D♯", "E", "F",
    "F♯", "G", "G♯", "A", "A♯", "B",
  ];
  const roots = notes;

  const scales = [
    "Major",
    "Minor",
    "Dorian",
    "Phrygian",
    "Lydian",
    "Mixolydian",
    "Locrian",
  ];

  // your original pattern text for the "Tones" row
  const scalePatterns: Record<string, string> = {
    Major:      "T - T - S - T - T - T - S",
    Minor:      "T - S - T - T - S - T - T",
    Dorian:     "T - S - T - T - T - S - T",
    Phrygian:   "S - T - T - T - S - T - T",
    Lydian:     "T - T - S - T - S - T - T",
    Mixolydian: "T - T - S - T - T - S - T",
    Locrian:    "S - T - T - S - T - T - T",
  };

  // semitone steps for computing actual notes
  const scaleIntervals: Record<string, number[]> = {
    Major:      [2, 2, 1, 2, 2, 2, 1],
    Minor:      [2, 1, 2, 2, 1, 2, 2],
    Dorian:     [2, 1, 2, 2, 2, 1, 2],
    Phrygian:   [1, 2, 2, 2, 1, 2, 2],
    Lydian:     [2, 2, 2, 1, 2, 2, 1],
    Mixolydian: [2, 2, 1, 2, 2, 1, 2],
    Locrian:    [1, 2, 2, 1, 2, 2, 2],
  };

  // helper: walk the chromatic circle and return 8 notes (incl. octave)
  function generateScaleTones(root: string, mode: string): string[] {
    const intervals = scaleIntervals[mode];
    let idx = notes.indexOf(root);
    const result = [root];
    for (let step of intervals) {
      idx = (idx + step) % notes.length;
      result.push(notes[idx]);
    }
    return result;
  }

  // initialize to C Major
  const initialScaleTones = generateScaleTones("C", "Major").join(" - ");
  const [computedScaleNotes, setComputedScaleNotes] = useState<string>(
    initialScaleTones
  );

  const maxBpm = 140;
  const minBpm = 75;

  const sounds = [
    "Guitar", "Bass", "Percussion", "Pad", "Synth", "Arp",
    "Accoustic", "Box", "Coin on strings", "FX", "Lead",
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
      setTonesEl(scalePatterns[newScale]);
    }

    // COMPUTED scale tones with dashes/spaces
    const tonesArr = generateScaleTones(newRoot, newScale);
    setComputedScaleNotes(tonesArr.join(" - "));

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
    <div className="inspiration-generator">
      <p className="sub-title">
        <b><u>Inspiration generator:</u></b><br />
        Roll the dice to generate a random rule set
      </p>

      <i
        onClick={rollDice}
        className={`dice fas fa-dice dice-icon ${
          animate ? "animate" : ""
        }`}
      />

      <table>
        <tbody>
          <tr>
            <th>
              <i
                className={`fas ${
                  locked.root ? "fa-lock" : "fa-unlock"
                } lock-icon`}
                onClick={() => toggleLock("root")}
              />
            </th>
            <td>Root</td>
            <td className="td-value">{rootEl}</td>
          </tr>
          <tr>
            <th>
              <i
                className={`fas ${
                  locked.scaleAndTones ? "fa-lock" : "fa-unlock"
                } lock-icon`}
                onClick={() => toggleLock("scaleAndTones")}
              />
            </th>
            <td>Scale</td>
            <td className="td-value">{scaleEl}</td>
          </tr>

          {/* original pattern */}
          <tr>
            <th />
            <td>Tones</td>
            <td className="td-value">{tonesEl}</td>
          </tr>

          {/* new computed-note row */}
          <tr>
            <th />
            <td>Scale Tones</td>
            <td className="td-value">{computedScaleNotes}</td>
          </tr>

          <tr>
            <th>
              <i
                className={`fas ${
                  locked.bpm ? "fa-lock" : "fa-unlock"
                } lock-icon`}
                onClick={() => toggleLock("bpm")}
              />
            </th>
            <td>BPM</td>
            <td className="td-value">{bpmEl}</td>
          </tr>
          <tr>
            <th>
              <i
                className={`fas ${
                  locked.sound ? "fa-lock" : "fa-unlock"
                } lock-icon`}
                onClick={() => toggleLock("sound")}
              />
            </th>
            <td>Sound</td>
            <td className="td-value">{soundEl}</td>
          </tr>
        </tbody>
      </table>

      <Metronome bpm={parseInt(bpmEl)} />
    </div>
  );
}
