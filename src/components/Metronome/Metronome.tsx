import React, { FC, useEffect, useState } from "react";
import * as Tone from 'tone';

import './Metronome.css'

interface LoaderProps {
    bpm: number;
}

const Metronome: FC<LoaderProps> = ({ bpm }) => {
    const [ metronomePlaying, setMetronomePlaying ] = useState(false);
    const [ metronomeDirection, setMetronomeDirection ] = useState(false);
    const [ muteSound, setMuteSoud ] = useState(false)
    let intervalId: NodeJS.Timeout | null = null;

    useEffect(() => {
        if (metronomePlaying) {
            Tone.start() // 
            const intervalTime = 60000 / bpm; // Calculate interval time based on BPM
            intervalId = setInterval(() => {
                if (!muteSound) { playSound() }
                setMetronomeDirection((prevDirection) => !prevDirection);
            }, intervalTime);

        } else if (intervalId !== null) {
            clearInterval(intervalId);
        }

        return () => {
            if (intervalId !== null) {
                clearInterval(intervalId);
            }
        };
    }, [metronomePlaying, bpm]);

    const playSound = () => {
        // Initialize synth values
        const synth = new Tone.Synth({
          oscillator: {
            type: 'square',
          },
          envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.0,
            release: 0.1,
          },
        }).toDestination();
        // Adjust this value to control the volume (in decibels)
        synth.volume.value = -42; 
        // Play a note
        const now = Tone.now()
        synth.triggerAttackRelease('440', '8n', now);
        // Clean up when the component unmounts
        return () => {
          synth.dispose(); 
        };
      }

    return (
        <div>
            <img
                className={`metronome ${metronomeDirection ? "metronome-tick-left" : "metronome-tick-right"}`}
                src={process.env.PUBLIC_URL + '/metronome.png'} alt="Metronome"
                onClick={() => setMetronomePlaying(!metronomePlaying)}
            />
            <div onClick={(e) => { setMuteSoud(!muteSound) }}>
                { muteSound ? (
                    <i className="fas fa-volume-mute sound-off-icon" />
                ) : (
                    <i className="fas fa-volume-up sound-on-icon" />
                )}
                
                
            </div>
        </div>
    )
}

export default Metronome;
