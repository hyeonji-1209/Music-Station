import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import * as Tone from 'tone';
import Piano from '../components/Piano';
import DrumKit from '../components/DrumKit';
import { InstrumentType } from '../components/layout/Side';
import { getInstrumentLabel } from '../utils/instruments';
import { OSMD_CONFIG } from '../utils/osmd';
import '../style/screens/Home.scss';

// 반짝반짝 작은별 음표 데이터
const twinkleTwinkleNotes = [
  { note: 'C4', duration: 500 },
  { note: 'C4', duration: 500 },
  { note: 'G4', duration: 500 },
  { note: 'G4', duration: 500 },
  { note: 'A4', duration: 500 },
  { note: 'A4', duration: 500 },
  { note: 'G4', duration: 1000 },
  { note: 'F4', duration: 500 },
  { note: 'F4', duration: 500 },
  { note: 'E4', duration: 500 },
  { note: 'E4', duration: 500 },
  { note: 'D4', duration: 500 },
  { note: 'D4', duration: 500 },
  { note: 'C4', duration: 1000 },
];

// 키 옵션 (반음 포함)
const keyOptions = [
  { label: 'C (도)', value: 0 },
  { label: 'C# / Db (도#/레♭)', value: 1 },
  { label: 'D (레)', value: 2 },
  { label: 'D# / Eb (레#/미♭)', value: 3 },
  { label: 'E (미)', value: 4 },
  { label: 'F (파)', value: 5 },
  { label: 'F# / Gb (파#/솔♭)', value: 6 },
  { label: 'G (솔)', value: 7 },
  { label: 'G# / Ab (솔#/라♭)', value: 8 },
  { label: 'A (라)', value: 9 },
  { label: 'A# / Bb (라#/시♭)', value: 10 },
  { label: 'B (시)', value: 11 },
];

interface HomeProps {
  selectedInstrument: InstrumentType;
}

const drumNotes = [
  { drum: 'kick', duration: 500 },
  { drum: 'snare', duration: 500 },
  { drum: 'hihat', duration: 500 },
  { drum: 'snare', duration: 500 },
  { drum: 'kick', duration: 500 },
  { drum: 'hihat', duration: 500 },
  { drum: 'snare', duration: 500 },
  { drum: 'hihat', duration: 500 },
  { drum: 'kick', duration: 500 },
  { drum: 'snare', duration: 500 },
  { drum: 'kick', duration: 500 },
  { drum: 'snare', duration: 500 },
  { drum: 'kick', duration: 500 },
  { drum: 'hihat', duration: 500 },
  { drum: 'snare', duration: 1000 },
];

const Home: React.FC<HomeProps> = ({ selectedInstrument }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const pianoRef = useRef<Tone.Sampler | null>(null);
  const drumRef = useRef<Tone.Players | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(-1);
  const [transposeValue, setTransposeValue] = useState<number>(0);
  const [bpm, setBpm] = useState<number>(120);

  useEffect(() => {
    if (!containerRef.current) return;

    pianoRef.current = new Tone.Sampler({
      urls: {
        A0: "A0.mp3", C1: "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
        A1: "A1.mp3", C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
        A2: "A2.mp3", C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
        A3: "A3.mp3", C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
        A4: "A4.mp3", C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
        A5: "A5.mp3", C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3",
        A6: "A6.mp3", C7: "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3",
        A7: "A7.mp3", C8: "C8.mp3"
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/"
    }).toDestination();

    drumRef.current = new Tone.Players({
      urls: {
        kick: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/kick.mp3",
        snare: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/snare.mp3",
        hihat: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/hihat.mp3",
      }
    }).toDestination();

    return () => {
      osmdRef.current?.clear();
      pianoRef.current?.dispose();
      drumRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    loadAndRenderSheet();
  }, [transposeValue, selectedInstrument]);

  const loadAndRenderSheet = async () => {
    if (!containerRef.current) return;

    try {
      if (osmdRef.current) osmdRef.current.clear();
      containerRef.current.innerHTML = '';

      osmdRef.current = new OpenSheetMusicDisplay(containerRef.current, OSMD_CONFIG);

      const xmlFile = selectedInstrument === 'drum' ? '/musicxml/drum.xml' : '/musicxml/twinkle.xml';
      const response = await fetch(xmlFile);
      let xmlText = await response.text();

      if (transposeValue !== 0 && selectedInstrument !== 'drum') {
        xmlText = transposeXML(xmlText, transposeValue);
      }

      await osmdRef.current.load(xmlText);
      osmdRef.current.render();
    } catch (error) {
      console.error('Error loading MusicXML:', error);
    }
  };

  const transposeXML = (xmlText: string, semitones: number): string => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const pitches = xmlDoc.getElementsByTagName('pitch');
    const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const semitoneToNote: { [key: number]: { step: string; alter: number } } = {
      0: { step: 'C', alter: 0 }, 1: { step: 'C', alter: 1 },
      2: { step: 'D', alter: 0 }, 3: { step: 'D', alter: 1 },
      4: { step: 'E', alter: 0 }, 5: { step: 'F', alter: 0 },
      6: { step: 'F', alter: 1 }, 7: { step: 'G', alter: 0 },
      8: { step: 'G', alter: 1 }, 9: { step: 'A', alter: 0 },
      10: { step: 'A', alter: 1 }, 11: { step: 'B', alter: 0 },
    };

    for (let i = 0; i < pitches.length; i++) {
      const pitch = pitches[i];
      const stepEl = pitch.getElementsByTagName('step')[0];
      const octaveEl = pitch.getElementsByTagName('octave')[0];
      const alterEl = pitch.getElementsByTagName('alter')[0];

      if (!stepEl || !octaveEl) continue;

      const step = stepEl.textContent || 'C';
      const octave = parseInt(octaveEl.textContent || '4');
      const alter = alterEl ? parseInt(alterEl.textContent || '0') : 0;

      const noteIndex = noteNames.indexOf(step);
      const stepsToC = [0, 2, 4, 5, 7, 9, 11][noteIndex];
      let totalSemitones = stepsToC + alter + (octave * 12) + semitones;

      const newOctave = Math.floor(totalSemitones / 12);
      const semitonesInOctave = ((totalSemitones % 12) + 12) % 12;
      const newNote = semitoneToNote[semitonesInOctave];

      stepEl.textContent = newNote.step;
      octaveEl.textContent = newOctave.toString();

      if (newNote.alter !== 0) {
        if (alterEl) {
          alterEl.textContent = newNote.alter.toString();
        } else {
          const newAlterEl = xmlDoc.createElement('alter');
          newAlterEl.textContent = newNote.alter.toString();
          pitch.insertBefore(newAlterEl, octaveEl);
        }
      } else if (alterEl) {
        pitch.removeChild(alterEl);
      }
    }

    return new XMLSerializer().serializeToString(xmlDoc);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const allNotes = containerRef.current.querySelectorAll('.vf-stavenote');
    allNotes.forEach((note) => {
      (note as SVGElement).style.fill = '#000';
      (note as SVGElement).style.stroke = '#000';
    });

    if (currentNoteIndex >= 0 && currentNoteIndex < allNotes.length) {
      const currentNote = allNotes[currentNoteIndex] as SVGElement;
      currentNote.style.fill = '#2196F3';
      currentNote.style.stroke = '#2196F3';

      currentNote.querySelectorAll('*').forEach((child) => {
        (child as SVGElement).style.fill = '#2196F3';
        (child as SVGElement).style.stroke = '#2196F3';
      });
    }
  }, [currentNoteIndex]);

  const playPiano = async (note: string, duration: number) => {
    if (!pianoRef.current) return;
    if (Tone.getContext().state !== 'running') await Tone.start();
    pianoRef.current.triggerAttackRelease(note, duration / 1000);
  };

  const playDrum = async (drum: string) => {
    if (!drumRef.current) return;
    if (Tone.getContext().state !== 'running') await Tone.start();
    drumRef.current.player(drum).start();
  };

  useEffect(() => {
    if (!isPlaying) return;

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const playNextNote = () => {
      if (selectedInstrument === 'drum') {
        if (currentIndex >= drumNotes.length) {
          setIsPlaying(false);
          setCurrentNoteIndex(-1);
          return;
        }

        setCurrentNoteIndex(currentIndex);

        const { drum, duration } = drumNotes[currentIndex];
        const adjustedDuration = (duration * 120) / bpm;

        playDrum(drum);

        timeoutId = setTimeout(() => {
          currentIndex++;
          playNextNote();
        }, adjustedDuration);
      } else {
        if (currentIndex >= twinkleTwinkleNotes.length) {
          setIsPlaying(false);
          setCurrentNoteIndex(-1);
          return;
        }

        setCurrentNoteIndex(currentIndex);

        const { note, duration } = twinkleTwinkleNotes[currentIndex];
        const transposedNote = getTransposedNote(note, transposeValue);
        const adjustedDuration = (duration * 120) / bpm;

        playPiano(transposedNote, adjustedDuration);

        timeoutId = setTimeout(() => {
          currentIndex++;
          playNextNote();
        }, adjustedDuration);
      }
    };

    playNextNote();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying, transposeValue, bpm, selectedInstrument]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) setCurrentNoteIndex(-1);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTransposeValue(parseInt(e.target.value));
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(parseInt(e.target.value));
  };

  const getTransposedNote = (note: string, semitones: number): string => {
    const noteMap: { [key: string]: number } = {
      'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
    };
    const reverseNoteMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    const noteName = note[0].toUpperCase();
    const octave = parseInt(note[1]);
    const baseSemitone = noteMap[noteName];

    const totalSemitone = baseSemitone + semitones;
    const newOctave = octave + Math.floor(totalSemitone / 12);
    const newSemitone = ((totalSemitone % 12) + 12) % 12;

    return `${reverseNoteMap[newSemitone]}${newOctave}`;
  };

  const currentKey = keyOptions.find(k => k.value === transposeValue)?.label || 'C (도)';

  return (
    <div className="home">
      <div className="home__container">
        <h1 className="home__title">반짝반짝 작은별 - {getInstrumentLabel(selectedInstrument)}</h1>

        <div className="home__controls">
          {selectedInstrument !== 'drum' && (
            <div className="home__key-selector">
              <label className="home__label">
                키 선택:
                <select
                  className="home__select"
                  value={transposeValue}
                  onChange={handleKeyChange}
                >
                  {keyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <div className="home__bpm-selector">
            <label className="home__label">
              BPM:
              <div className="home__bpm-control">
                <input
                  type="range"
                  className="home__bpm-slider"
                  min="40"
                  max="240"
                  value={bpm}
                  onChange={handleBpmChange}
                />
                <input
                  type="number"
                  className="home__bpm-input"
                  min="40"
                  max="240"
                  value={bpm}
                  onChange={handleBpmChange}
                />
              </div>
            </label>
          </div>

          <button
            className="home__play-button"
            onClick={handlePlayPause}
          >
            {isPlaying ? '⏸ 정지' : '▶ 재생'}
          </button>
        </div>

        {selectedInstrument === 'drum' && (
          <div className="home__drum-legend">
            <h3>드럼 파트 설명</h3>
            <div className="home__drum-legend-items">
              <div className="home__drum-legend-item">
                <span className="home__drum-legend-symbol">C (X)</span>
                <span className="home__drum-legend-label">Bass Drum (킥)</span>
              </div>
              <div className="home__drum-legend-item">
                <span className="home__drum-legend-symbol">E (○)</span>
                <span className="home__drum-legend-label">Snare Drum (스네어)</span>
              </div>
              <div className="home__drum-legend-item">
                <span className="home__drum-legend-symbol">G (X)</span>
                <span className="home__drum-legend-label">Hi-Hat (하이햇)</span>
              </div>
            </div>
          </div>
        )}

        <div className="musical-staff">
          <div ref={containerRef} id="osmd-container" />
        </div>

        {/* 피아노 건반 - 피아노일 때만 표시 */}
        {selectedInstrument === 'piano' && (
          <Piano
            activeNote={
              currentNoteIndex >= 0
                ? getTransposedNote(twinkleTwinkleNotes[currentNoteIndex].note, transposeValue)
                : undefined
            }
          />
        )}

        {/* 드럼킷 - 드럼일 때만 표시 */}
        {selectedInstrument === 'drum' && (
          <DrumKit activeDrum={currentNoteIndex >= 0 ? drumNotes[currentNoteIndex].drum : undefined} />
        )}

        <div className="home__info">
          {selectedInstrument !== 'drum' && <p>현재 키: {currentKey}</p>}
          <p>BPM: {bpm}</p>
          <p>재생 중: {isPlaying ? '예' : '아니오'}</p>
          {currentNoteIndex >= 0 && selectedInstrument === 'piano' && (
            <p>현재 음표: {twinkleTwinkleNotes[currentNoteIndex].note}</p>
          )}
          {currentNoteIndex >= 0 && selectedInstrument === 'drum' && (
            <p>현재 드럼: {drumNotes[currentNoteIndex].drum}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
