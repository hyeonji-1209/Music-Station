import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import Piano from '../components/Piano';
import '../style/screens/Home.scss';

// 음표 이름을 주파수로 변환
const noteToFrequency = (note: string, transpose: number = 0): number => {
  const noteMap: { [key: string]: number } = {
    'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
  };

  const noteName = note[0].toUpperCase();
  const octave = parseInt(note[1]);
  const semitone = noteMap[noteName];

  const A4 = 440;
  const C4 = A4 * Math.pow(2, -9/12);
  const noteNumber = semitone + (octave * 12) + transpose;
  const C4Number = 0 + (4 * 12);

  return C4 * Math.pow(2, (noteNumber - C4Number) / 12);
};

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

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(-1);
  const [transposeValue, setTransposeValue] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // AudioContext 초기화
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    return () => {
      osmdRef.current?.clear();
      audioContextRef.current?.close();
    };
  }, []);

  // 키 변경 시 악보 다시 렌더링
  useEffect(() => {
    loadAndRenderSheet();
  }, [transposeValue]);

  const loadAndRenderSheet = async () => {
    if (!containerRef.current) return;

    try {
      // 이전 인스턴스 정리
      if (osmdRef.current) {
        osmdRef.current.clear();
      }

      // 컨테이너 내용 완전히 비우기
      containerRef.current.innerHTML = '';

      // OpenSheetMusicDisplay 재생성
      osmdRef.current = new OpenSheetMusicDisplay(containerRef.current, {
        autoResize: false,
        backend: 'svg',
        drawTitle: false,
        drawSubtitle: false,
        drawComposer: false,
        drawCredits: false,
        drawingParameters: 'compact',
      });

      // MusicXML 파일 가져오기
      const response = await fetch('/musicxml/twinkle.xml');
      let xmlText = await response.text();

      // 조옮김이 필요한 경우 XML 수정
      if (transposeValue !== 0) {
        xmlText = transposeXML(xmlText, transposeValue);
      }

      // 수정된 XML 로드
      await osmdRef.current.load(xmlText);
      osmdRef.current.render();
    } catch (error) {
      console.error('Error loading MusicXML:', error);
    }
  };

  // MusicXML의 음표를 조옮김하는 함수
  const transposeXML = (xmlText: string, semitones: number): string => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // 모든 pitch 요소 찾기
    const pitches = xmlDoc.getElementsByTagName('pitch');

    const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    for (let i = 0; i < pitches.length; i++) {
      const pitch = pitches[i];
      const stepEl = pitch.getElementsByTagName('step')[0];
      const octaveEl = pitch.getElementsByTagName('octave')[0];
      const alterEl = pitch.getElementsByTagName('alter')[0];

      if (!stepEl || !octaveEl) continue;

      let step = stepEl.textContent || 'C';
      let octave = parseInt(octaveEl.textContent || '4');
      let alter = alterEl ? parseInt(alterEl.textContent || '0') : 0;

      // 현재 음표를 반음 단위로 변환
      const noteIndex = noteNames.indexOf(step);
      const stepsToC = [0, 2, 4, 5, 7, 9, 11][noteIndex]; // C=0, D=2, E=4, F=5, G=7, A=9, B=11
      let totalSemitones = stepsToC + alter + (octave * 12);

      // 조옮김 적용
      totalSemitones += semitones;

      // 다시 음계로 변환
      const newOctave = Math.floor(totalSemitones / 12);
      let semitonesInOctave = ((totalSemitones % 12) + 12) % 12;

      // 반음을 음계로 변환
      const semitoneToNote: { [key: number]: { step: string; alter: number } } = {
        0: { step: 'C', alter: 0 },
        1: { step: 'C', alter: 1 },
        2: { step: 'D', alter: 0 },
        3: { step: 'D', alter: 1 },
        4: { step: 'E', alter: 0 },
        5: { step: 'F', alter: 0 },
        6: { step: 'F', alter: 1 },
        7: { step: 'G', alter: 0 },
        8: { step: 'G', alter: 1 },
        9: { step: 'A', alter: 0 },
        10: { step: 'A', alter: 1 },
        11: { step: 'B', alter: 0 },
      };

      const newNote = semitoneToNote[semitonesInOctave];

      // XML 업데이트
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

    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
  };

  // 재생 중인 음표 파란색으로 하이라이트
  useEffect(() => {
    if (!containerRef.current) return;

    // 모든 음표를 기본 색으로 되돌리기
    const allNotes = containerRef.current.querySelectorAll('.vf-stavenote');
    allNotes.forEach((note) => {
      (note as SVGElement).style.fill = '#000';
      (note as SVGElement).style.stroke = '#000';
    });

    // 현재 재생 중인 음표를 파란색으로
    if (currentNoteIndex >= 0 && currentNoteIndex < allNotes.length) {
      const currentNote = allNotes[currentNoteIndex] as SVGElement;
      currentNote.style.fill = '#2196F3';
      currentNote.style.stroke = '#2196F3';

      // 하위 요소들도 파란색으로
      const children = currentNote.querySelectorAll('*');
      children.forEach((child) => {
        (child as SVGElement).style.fill = '#2196F3';
        (child as SVGElement).style.stroke = '#2196F3';
      });
    }
  }, [currentNoteIndex]);

  // 소리 재생 함수
  const playSound = (frequency: number, duration: number) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);

    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
  };

  // 재생 로직
  useEffect(() => {
    if (!isPlaying) return;

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const playNextNote = () => {
      if (currentIndex >= twinkleTwinkleNotes.length) {
        setIsPlaying(false);
        setCurrentNoteIndex(-1);
        return;
      }

      setCurrentNoteIndex(currentIndex);

      const { note, duration } = twinkleTwinkleNotes[currentIndex];
      const frequency = noteToFrequency(note, transposeValue);
      playSound(frequency, duration);

      timeoutId = setTimeout(() => {
        currentIndex++;
        playNextNote();
      }, duration);
    };

    playNextNote();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying, transposeValue]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentNoteIndex(-1);
    } else {
      setIsPlaying(true);
    }
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTransposeValue(parseInt(e.target.value));
  };

  const currentKey = keyOptions.find(k => k.value === transposeValue)?.label || 'C (도)';

  // 음표를 조옮김하는 헬퍼 함수
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

  return (
    <div className="home">
      <div className="home__container">
        <h1 className="home__title">반짝반짝 작은별</h1>

        <div className="home__controls">
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

          <button
            className="home__play-button"
            onClick={handlePlayPause}
          >
            {isPlaying ? '⏸ 정지' : '▶ 재생'}
          </button>
        </div>

        <div className="musical-staff">
          <div ref={containerRef} id="osmd-container" />
        </div>

        {/* 피아노 건반 */}
        <Piano
          activeNote={
            currentNoteIndex >= 0
              ? getTransposedNote(twinkleTwinkleNotes[currentNoteIndex].note, transposeValue)
              : undefined
          }
        />

        <div className="home__info">
          <p>현재 키: {currentKey}</p>
          <p>재생 중: {isPlaying ? '예' : '아니오'}</p>
          {currentNoteIndex >= 0 && (
            <p>현재 음표: {twinkleTwinkleNotes[currentNoteIndex].note}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
