import React, { useEffect, useRef } from 'react';
import '../style/components/Piano.scss';

interface PianoProps {
  activeNote?: string; // 현재 활성화된 음표 (예: 'C4', 'D4')
}

// 88건반 피아노 생성 (A0 ~ C8)
const generatePianoKeys = () => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const koreanLabels: { [key: string]: string } = {
    'C': '도', 'C#': '도#', 'D': '레', 'D#': '레#', 'E': '미', 'F': '파',
    'F#': '파#', 'G': '솔', 'G#': '솔#', 'A': '라', 'A#': '라#', 'B': '시'
  };

  const keys = [];

  // A0, A#0, B0 (첫 3개 건반)
  keys.push({ note: 'A0', type: 'white', label: '라' });
  keys.push({ note: 'A#0', type: 'black', label: '라#' });
  keys.push({ note: 'B0', type: 'white', label: '시' });

  // C1 ~ B7 (전체 옥타브)
  for (let octave = 1; octave <= 7; octave++) {
    for (const note of notes) {
      const noteName = `${note}${octave}`;
      const type = note.includes('#') ? 'black' : 'white';
      keys.push({ note: noteName, type, label: koreanLabels[note] });
    }
  }

  // C8 (마지막 건반)
  keys.push({ note: 'C8', type: 'white', label: '도' });

  return keys;
};

const Piano: React.FC<PianoProps> = ({ activeNote }) => {
  const pianoKeys = generatePianoKeys();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeKeyRef = useRef<HTMLDivElement>(null);

  // 활성 노트가 변경되면 해당 건반으로 스크롤
  useEffect(() => {
    if (activeNote && activeKeyRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeKey = activeKeyRef.current;

      // 건반의 위치 계산
      const keyLeft = activeKey.offsetLeft;
      const keyWidth = activeKey.offsetWidth;
      const containerWidth = container.offsetWidth;

      // 건반이 중앙에 오도록 스크롤
      const scrollPosition = keyLeft - (containerWidth / 2) + (keyWidth / 2);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [activeNote]);

  return (
    <div className="piano">
      <div className="piano__scroll-container" ref={scrollContainerRef}>
        <div className="piano__keys">
          {pianoKeys.map((key) => {
            const isActive = activeNote === key.note;
            return (
              <div
                key={key.note}
                ref={isActive ? activeKeyRef : null}
                className={`piano__key piano__key--${key.type} ${
                  isActive ? 'piano__key--active' : ''
                }`}
              >
                <span className="piano__key-label">{key.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Piano;
