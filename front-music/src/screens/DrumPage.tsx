import React, { useState } from 'react';
import * as Tone from 'tone';
import DrumKit from '../components/DrumKit';
import { BpmControl, MusicStaff, DrumLegend } from '../components/music';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { useDrumSampler } from '../hooks/useDrumSampler';
import { calculateBeatDuration } from '../utils/music';
import { DRUM_NOTES } from '../constants/notes';

const drumNotes = DRUM_NOTES.map(note => ({ drum: note.drum!, duration: 500 }));

const DrumPage: React.FC = () => {
  const [bpm, setBpm] = useState(120);

  const { isPlaying, setIsPlaying, currentNoteIndex, setCurrentNoteIndex } = useMusicPlayer({
    musicXmlPath: '/musicxml/drum.xml',
    instrumentType: 'drum'
  });

  const drumRef = useDrumSampler();

  const playDrums = async () => {
    if (!drumRef.current) return;

    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }

    setIsPlaying(true);
    setCurrentNoteIndex(0);

    const beatDuration = calculateBeatDuration(bpm);
    const currentTime = Tone.now();

    drumNotes.forEach((drumNote, index) => {
      const noteOffset = index * beatDuration;

      setTimeout(() => {
        setCurrentNoteIndex(index);
      }, (currentTime - Tone.now() + noteOffset) * 1000);

      drumRef.current?.player(drumNote.drum).start(currentTime + noteOffset);
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
          <BpmControl bpm={bpm} onBpmChange={setBpm} />
          <button
            onClick={playDrums}
            disabled={isPlaying}
            className="home__play-button"
          >
            {isPlaying ? '연주 중...' : '재생'}
          </button>
        </div>

        <DrumLegend />

        <MusicStaff loadingMessage="드럼 악보를 로딩 중..." />

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
