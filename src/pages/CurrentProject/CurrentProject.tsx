import React, { FC, useState, useEffect } from "react";
import './CurrentProject.css'
import PomodoroTimer from "../../components/pomodoroTimer/pomodoroTimer";
import Divider from "../../components/Divider/Divider";
import InspirationGenerator from "../../components/inspirationGenerator/inspirationGenerator"
import NotePad from "../../components/Notepad/Notepad"

interface LoaderProps {
    result: string;
}

const CurrentProject: FC<LoaderProps> = ({ result: passedResult }) => {
    const [result, setResult] = useState(passedResult || "");
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

    return (
        <div className="current-project">
            <PomodoroTimer />
            <Divider />
            <InspirationGenerator 
                animate={animate}   setAnimate={setAnimate}
                rootEl={rootEl}     setRootEl={setRootEl}
                scaleEl={scaleEl}   setScaleEl={setScaleEl}
                tonesEl={tonesEl}   setTonesEl={setTonesEl}
                tonesArrEl={tonesArrEl} setTonesArrEl={setTonesArrEl}
                bpmEl={bpmEl}       setBpmEl={setBpmEl}
                soundEl={soundEl}   setSoundEl={setSoundEl}
            />
            <Divider />
            <NotePad notes={notes} setNotes={setNotes} />
        </div>
    );
}

export default CurrentProject;
