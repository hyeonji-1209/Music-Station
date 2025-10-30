import React, { useEffect, useRef, useMemo } from 'react';
import '../style/components/Piano.scss';

interface PianoProps {
  activeNote?: string;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const KOREAN_LABELS: { [key: string]: string } = {
  'C': '도', 'C#': '도#', 'D': '레', 'D#': '레#', 'E': '미', 'F': '파',
  'F#': '파#', 'G': '솔', 'G#': '솔#', 'A': '라', 'A#': '라#', 'B': '시'
};

const generatePianoKeys = () => {
  const keys = [
    { note: 'A0', type: 'white', label: '라' },
    { note: 'A#0', type: 'black', label: '라#' },
    { note: 'B0', type: 'white', label: '시' }
  ];

  for (let octave = 1; octave <= 7; octave++) {
    for (const note of NOTES) {
      keys.push({
        note: `${note}${octave}`,
        type: note.includes('#') ? 'black' : 'white',
        label: KOREAN_LABELS[note]
      });
    }
  }

  keys.push({ note: 'C8', type: 'white', label: '도' });
  return keys;
};

const Piano: React.FC<PianoProps> = ({ activeNote }) => {
  const pianoKeys = useMemo(() => generatePianoKeys(), []);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeKeyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeNote || !activeKeyRef.current || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const activeKey = activeKeyRef.current;
    const scrollPosition = activeKey.offsetLeft - (container.offsetWidth / 2) + (activeKey.offsetWidth / 2);

    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
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
