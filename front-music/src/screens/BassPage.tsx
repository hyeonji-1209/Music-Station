import React, { useState, useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import * as Tone from 'tone';
import '../style/screens/Home.scss';
import { OSMD_CONFIG } from '../utils/osmd';

const bassNotes = [
  { note: 'C2', duration: '4n' }, { note: 'C2', duration: '4n' },
  { note: 'G2', duration: '4n' }, { note: 'G2', duration: '4n' },
  { note: 'A2', duration: '4n' }, { note: 'A2', duration: '4n' },
  { note: 'G2', duration: '2n' },
  { note: 'F2', duration: '4n' }, { note: 'F2', duration: '4n' },
  { note: 'E2', duration: '4n' }, { note: 'E2', duration: '4n' },
  { note: 'D2', duration: '4n' }, { note: 'D2', duration: '4n' },
  { note: 'C2', duration: '2n' },
];

type KeyType = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

const BassPage: React.FC = () => {
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const bassRef = useRef<Tone.Sampler | null>(null);
  const isMountedRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [selectedKey, setSelectedKey] = useState<KeyType>('C');
  const [bpm, setBpm] = useState(120);

  useEffect(() => {
    isMountedRef.current = true;

    const loadMusicXML = async () => {
      if (!isMountedRef.current) return;

      const container = document.getElementById('osmd-container');
      if (!container) {
        console.error('osmd-container not found');
        return;
      }

      // 기존 OSMD 인스턴스 완전히 정리
      if (osmdRef.current) {
        try {
          osmdRef.current.clear();
          osmdRef.current = null;
        } catch (e) {
          console.log('Error clearing OSMD:', e);
        }
      }

      // 컨테이너 완전히 클리어
      container.innerHTML = '';

      try {
        console.log('Loading Bass MusicXML...');

        // 새로운 OSMD 인스턴스 생성
        const osmd = new OpenSheetMusicDisplay(container, OSMD_CONFIG);
        console.log('OSMD instance created');

        await osmd.load('/musicxml/bass.xml');
        console.log('Bass MusicXML loaded');

        if (!isMountedRef.current) return;

        await osmd.render();
        console.log('OSMD rendered');

        if (!isMountedRef.current) return;

        osmdRef.current = osmd;

        // 렌더링 후 컨테이너 확인
        console.log('Container children:', container.children.length);
      } catch (error) {
        console.error('Error loading Bass MusicXML:', error);
      }
    };

    // 약간의 지연을 두고 로드
    const timeoutId = setTimeout(loadMusicXML, 200);

    bassRef.current = new Tone.Sampler({
      urls: {
        C2: "C2.mp3", D2: "D2.mp3", E2: "E2.mp3", F2: "F2.mp3",
        G2: "G2.mp3", A2: "A2.mp3", B2: "B2.mp3", C3: "C3.mp3",
        D3: "D3.mp3", E3: "E3.mp3", F3: "F3.mp3", G3: "G3.mp3",
        A3: "A3.mp3", B3: "B3.mp3", C4: "C4.mp3"
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/"
    }).toDestination();

    // cleanup 함수
    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutId);

      if (osmdRef.current) {
        try {
          osmdRef.current.clear();
        } catch (e) {
          console.log('Error clearing OSMD on cleanup:', e);
        }
        osmdRef.current = null;
      }

      if (bassRef.current) {
        bassRef.current.disconnect();
        bassRef.current.dispose();
      }
    };
  }, []);

  const transposeNote = (note: string, fromKey: string, toKey: string): string => {
    const keyOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const fromIndex = keyOrder.indexOf(fromKey);
    const toIndex = keyOrder.indexOf(toKey);
    const diff = toIndex - fromIndex;

    const noteIndex = keyOrder.indexOf(note[0]);
    const newIndex = (noteIndex + diff + keyOrder.length) % keyOrder.length;
    return keyOrder[newIndex] + note.slice(1);
  };

  const playMelody = async () => {
    if (!bassRef.current) return;

    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }

    setIsPlaying(true);
    setCurrentNoteIndex(0);

    const beatDuration = 60 / bpm;
    let currentTime = Tone.now();

    bassNotes.forEach((noteObj, index) => {
      const transposedNote = transposeNote(noteObj.note, 'C', selectedKey);
      const noteDuration = noteObj.duration === '2n' ? beatDuration * 2 : beatDuration;

      setTimeout(() => {
        setCurrentNoteIndex(index);
      }, (currentTime - Tone.now() + (index > 0 ? bassNotes.slice(0, index).reduce((sum, n) =>
        sum + (n.duration === '2n' ? beatDuration * 2 : beatDuration), 0) : 0)) * 1000);

      bassRef.current?.triggerAttackRelease(
        transposedNote,
        noteObj.duration,
        currentTime + (index > 0 ? bassNotes.slice(0, index).reduce((sum, n) =>
          sum + (n.duration === '2n' ? beatDuration * 2 : beatDuration), 0) : 0)
      );
    });

    const totalDuration = bassNotes.reduce((sum, n) =>
      sum + (n.duration === '2n' ? beatDuration * 2 : beatDuration), 0);

    setTimeout(() => {
      setIsPlaying(false);
      setCurrentNoteIndex(-1);
    }, totalDuration * 1000);
  };

  return (
    <div className="home">
      <div className="home__container">
        <h1 className="home__title">베이스 연습</h1>

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

        <div className="home__drum-legend">
          <h3>베이스 악보 기호</h3>
          <div className="home__drum-legend-items">
            <div className="home__drum-legend-item">
              <span className="home__drum-legend-symbol">C2</span>
              <span className="home__drum-legend-label">Low C</span>
            </div>
            <div className="home__drum-legend-item">
              <span className="home__drum-legend-symbol">G2</span>
              <span className="home__drum-legend-label">G</span>
            </div>
            <div className="home__drum-legend-item">
              <span className="home__drum-legend-symbol">A2</span>
              <span className="home__drum-legend-label">A</span>
            </div>
          </div>
        </div>

        <div className="musical-staff">
          <div id="osmd-container">
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              베이스 악보를 로딩 중...
            </p>
          </div>
        </div>

        <div className="home__info">
          {currentNoteIndex >= 0 && (
            <p>현재 음표: {bassNotes[currentNoteIndex].note}</p>
          )}
          <p>BPM: {bpm}</p>
          <p>조성: {selectedKey}</p>
        </div>
      </div>
    </div>
  );
};

export default BassPage;
