import React, { useState, useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import * as Tone from 'tone';
import DrumKit from '../components/DrumKit';
import '../style/screens/Home.scss';
import { OSMD_CONFIG } from '../utils/osmd';

const drumNotes = [
  { drum: 'kick' }, { drum: 'snare' }, { drum: 'hihat' }, { drum: 'snare' },
  { drum: 'kick' }, { drum: 'hihat' }, { drum: 'snare' }, { drum: 'hihat' },
  { drum: 'kick' }, { drum: 'snare' }, { drum: 'kick' }, { drum: 'snare' },
  { drum: 'kick' }, { drum: 'hihat' }, { drum: 'snare' },
];

const DrumPage: React.FC = () => {
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const drumRef = useRef<Tone.Players | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [bpm, setBpm] = useState(120);

  useEffect(() => {
    const loadMusicXML = async () => {
      const container = document.getElementById('osmd-container');
      if (!container) return;

      try {
        const osmd = new OpenSheetMusicDisplay(container, OSMD_CONFIG);
        await osmd.load('/musicxml/drum.xml');
        osmd.render();
        osmdRef.current = osmd;
      } catch (error) {
        console.error('Error loading MusicXML:', error);
      }
    };

    loadMusicXML();

    drumRef.current = new Tone.Players({
      urls: {
        kick: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/kick.mp3",
        snare: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/snare.mp3",
        hihat: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/hihat.mp3",
      }
    }).toDestination();

    return () => {
      if (drumRef.current) {
        drumRef.current.disconnect();
        drumRef.current.dispose();
      }
    };
  }, []);

  const playDrums = async () => {
    if (!drumRef.current) return;

    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }

    setIsPlaying(true);
    setCurrentNoteIndex(0);

    const beatDuration = 60 / bpm;
    let currentTime = Tone.now();

    drumNotes.forEach((drumNote, index) => {
      setTimeout(() => {
        setCurrentNoteIndex(index);
      }, (currentTime - Tone.now() + index * beatDuration) * 1000);

      drumRef.current?.player(drumNote.drum).start(currentTime + index * beatDuration);
    });

    const totalDuration = drumNotes.length * beatDuration;

    setTimeout(() => {
      setIsPlaying(false);
      setCurrentNoteIndex(-1);
    }, totalDuration * 1000);
  };

  return (
    <div className="home">
      <div className="home__container">
        <h1 className="home__title">드럼 연습</h1>

        <div className="home__controls">
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
            onClick={playDrums}
            disabled={isPlaying}
            className="home__play-button"
          >
            {isPlaying ? '연주 중...' : '재생'}
          </button>
        </div>

        <div className="home__drum-legend">
          <h3>드럼 악보 기호</h3>
          <div className="home__drum-legend-items">
            <div className="home__drum-legend-item">
              <span className="home__drum-legend-symbol">C (X)</span>
              <span className="home__drum-legend-label">Bass Drum</span>
            </div>
            <div className="home__drum-legend-item">
              <span className="home__drum-legend-symbol">E (○)</span>
              <span className="home__drum-legend-label">Snare</span>
            </div>
            <div className="home__drum-legend-item">
              <span className="home__drum-legend-symbol">G (X)</span>
              <span className="home__drum-legend-label">Hi-Hat</span>
            </div>
          </div>
        </div>

        <div className="musical-staff">
          <div id="osmd-container"></div>
        </div>

        <DrumKit
          activeDrum={currentNoteIndex >= 0 ? drumNotes[currentNoteIndex].drum : undefined}
        />

        <div className="home__info">
          {currentNoteIndex >= 0 && (
            <p>현재 드럼: {drumNotes[currentNoteIndex].drum}</p>
          )}
          <p>BPM: {bpm}</p>
        </div>
      </div>
    </div>
  );
};

export default DrumPage;
