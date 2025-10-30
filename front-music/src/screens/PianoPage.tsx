import React, { useState, useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import * as Tone from 'tone';
import Piano from '../components/Piano';
import '../style/screens/Home.scss';
import { OSMD_CONFIG } from '../utils/osmd';

const twinkleTwinkleNotes = [
  { note: 'C', duration: '4n' }, { note: 'C', duration: '4n' },
  { note: 'G', duration: '4n' }, { note: 'G', duration: '4n' },
  { note: 'A', duration: '4n' }, { note: 'A', duration: '4n' },
  { note: 'G', duration: '2n' },
  { note: 'F', duration: '4n' }, { note: 'F', duration: '4n' },
  { note: 'E', duration: '4n' }, { note: 'E', duration: '4n' },
  { note: 'D', duration: '4n' }, { note: 'D', duration: '4n' },
  { note: 'C', duration: '2n' },
];

type KeyType = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

const PianoPage: React.FC = () => {
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const pianoRef = useRef<Tone.Sampler | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [selectedKey, setSelectedKey] = useState<KeyType>('C');
  const [bpm, setBpm] = useState(120);

  useEffect(() => {
    const loadMusicXML = async () => {
      const container = document.getElementById('osmd-container');
      if (!container) return;

      try {
        const osmd = new OpenSheetMusicDisplay(container, OSMD_CONFIG);
        await osmd.load('/musicxml/twinkle.xml');
        osmd.render();
        osmdRef.current = osmd;
      } catch (error) {
        console.error('Error loading MusicXML:', error);
      }
    };

    loadMusicXML();

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

    return () => {
      if (pianoRef.current) {
        pianoRef.current.disconnect();
        pianoRef.current.dispose();
      }
    };
  }, []);

  const transposeNote = (note: string, fromKey: string, toKey: string): string => {
    const keyOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const fromIndex = keyOrder.indexOf(fromKey);
    const toIndex = keyOrder.indexOf(toKey);
    const diff = toIndex - fromIndex;

    const noteIndex = keyOrder.indexOf(note);
    const newIndex = (noteIndex + diff + keyOrder.length) % keyOrder.length;
    return keyOrder[newIndex];
  };

  const playMelody = async () => {
    if (!pianoRef.current) return;

    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }

    setIsPlaying(true);
    setCurrentNoteIndex(0);

    const beatDuration = 60 / bpm;
    let currentTime = Tone.now();

    twinkleTwinkleNotes.forEach((noteObj, index) => {
      const transposedNote = transposeNote(noteObj.note, 'C', selectedKey);
      const fullNote = `${transposedNote}4`;

      const noteDuration = noteObj.duration === '2n' ? beatDuration * 2 : beatDuration;

      setTimeout(() => {
        setCurrentNoteIndex(index);
      }, (currentTime - Tone.now() + (index > 0 ? twinkleTwinkleNotes.slice(0, index).reduce((sum, n) =>
        sum + (n.duration === '2n' ? beatDuration * 2 : beatDuration), 0) : 0)) * 1000);

      pianoRef.current?.triggerAttackRelease(
        fullNote,
        noteObj.duration,
        currentTime + (index > 0 ? twinkleTwinkleNotes.slice(0, index).reduce((sum, n) =>
          sum + (n.duration === '2n' ? beatDuration * 2 : beatDuration), 0) : 0)
      );
    });

    const totalDuration = twinkleTwinkleNotes.reduce((sum, n) =>
      sum + (n.duration === '2n' ? beatDuration * 2 : beatDuration), 0);

    setTimeout(() => {
      setIsPlaying(false);
      setCurrentNoteIndex(-1);
    }, totalDuration * 1000);
  };

  return (
    <div className="home">
      <div className="home__container">
        <h1 className="home__title">피아노 연습</h1>

        <div className="home__controls">
          <div className="home__key-selector">
            <label className="home__label">
              조성:
              <select
                className="home__select"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value as KeyType)}
              >
                <option value="C">C (도)</option>
                <option value="D">D (레)</option>
                <option value="E">E (미)</option>
                <option value="F">F (파)</option>
                <option value="G">G (솔)</option>
                <option value="A">A (라)</option>
                <option value="B">B (시)</option>
              </select>
            </label>
          </div>

          <div className="home__bpm-selector">
            <label className="home__label">
              BPM: {bpm}
              <div className="home__bpm-control">
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="home__bpm-slider"
                />
                <input
                  type="number"
                  min="60"
                  max="200"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="home__bpm-input"
                />
              </div>
            </label>
          </div>

          <button
            onClick={playMelody}
            disabled={isPlaying}
            className="home__play-button"
          >
            {isPlaying ? '연주 중...' : '재생'}
          </button>
        </div>

        <div className="musical-staff">
          <div id="osmd-container"></div>
        </div>

        <Piano
          activeNote={currentNoteIndex >= 0 ? twinkleTwinkleNotes[currentNoteIndex].note : undefined}
        />

        <div className="home__info">
          {currentNoteIndex >= 0 && (
            <p>현재 음표: {twinkleTwinkleNotes[currentNoteIndex].note}</p>
          )}
          <p>BPM: {bpm}</p>
          <p>조성: {selectedKey}</p>
        </div>
      </div>
    </div>
  );
};

export default PianoPage;
