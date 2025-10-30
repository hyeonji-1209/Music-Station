import React, { useState } from 'react';
import * as Tone from 'tone';
import { BpmControl, KeySelector, MusicStaff, KeyType } from '../components/music';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { useBassSampler } from '../hooks/useBassSampler';
import { transposeNote, calculateBeatDuration, calculateTotalDuration, calculateNoteOffset } from '../utils/music';
import { BASS_NOTES } from '../constants/notes';

const BassPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<KeyType>('C');
  const [bpm, setBpm] = useState(120);

  const { isPlaying, setIsPlaying, currentNoteIndex, setCurrentNoteIndex } = useMusicPlayer({
    musicXmlPath: '/musicxml/bass.xml',
    instrumentType: 'piano'
  });

  const bassRef = useBassSampler();

  const playMelody = async () => {
    if (!bassRef.current) return;

    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }

    setIsPlaying(true);
    setCurrentNoteIndex(0);

    const beatDuration = calculateBeatDuration(bpm);
    const currentTime = Tone.now();

    BASS_NOTES.forEach((noteObj, index) => {
      const transposedNote = transposeNote(noteObj.note!, 'C', selectedKey);
      const fullNote = `${transposedNote}2`; // Bass octave
      const noteOffset = calculateNoteOffset(BASS_NOTES, index, beatDuration);

      setTimeout(() => {
        setCurrentNoteIndex(index);
      }, (currentTime - Tone.now() + noteOffset) * 1000);

      bassRef.current?.triggerAttackRelease(
        fullNote,
        noteObj.duration as string,
        currentTime + noteOffset
      );
    });

    const totalDuration = calculateTotalDuration(BASS_NOTES, beatDuration);

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
          <KeySelector selectedKey={selectedKey} onKeyChange={setSelectedKey} />
          <BpmControl bpm={bpm} onBpmChange={setBpm} />
          <button
            onClick={playMelody}
            disabled={isPlaying}
            className="home__play-button"
          >
            {isPlaying ? '연주 중...' : '재생'}
          </button>
        </div>

        <MusicStaff loadingMessage="베이스 악보를 로딩 중..." />

        <div className="home__info">
          {currentNoteIndex >= 0 && (
            <p>현재 음표: {BASS_NOTES[currentNoteIndex].note}</p>
          )}
          <p>BPM: {bpm}</p>
          <p>조성: {selectedKey}</p>
        </div>
      </div>
    </div>
  );
};

export default BassPage;
