import { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { getTransposedNote } from '../utils/music';

interface UsePlaybackProps {
  isPlaying: boolean;
  bpm: number;
  transposeValue: number;
  instrumentType: 'piano' | 'drum';
  notes: Array<{ note?: string; drum?: string; duration: number | string }>;
  instrumentRef: React.RefObject<Tone.Sampler | Tone.Players | null>;
}

export const usePlayback = ({
  isPlaying,
  bpm,
  transposeValue,
  instrumentType,
  notes,
  instrumentRef
}: UsePlaybackProps) => {
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);

  useEffect(() => {
    if (!isPlaying) return;

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const playNextNote = async () => {
      if (currentIndex >= notes.length) {
        setCurrentNoteIndex(-1);
        return;
      }

      setCurrentNoteIndex(currentIndex);

      const noteData = notes[currentIndex];
      const duration = typeof noteData.duration === 'number'
        ? noteData.duration
        : noteData.duration === '2n' ? 1000 : 500;
      const adjustedDuration = (duration * 120) / bpm;

      if (instrumentType === 'drum' && noteData.drum) {
        // Play drum
        if (!instrumentRef.current) return;
        if (Tone.getContext().state !== 'running') await Tone.start();
        (instrumentRef.current as Tone.Players).player(noteData.drum).start();
      } else if (instrumentType === 'piano' && noteData.note) {
        // Play piano
        if (!instrumentRef.current) return;
        if (Tone.getContext().state !== 'running') await Tone.start();
        const transposedNote = getTransposedNote(noteData.note, transposeValue);
        (instrumentRef.current as Tone.Sampler).triggerAttackRelease(
          transposedNote,
          adjustedDuration / 1000
        );
      }

      timeoutId = setTimeout(() => {
        currentIndex++;
        playNextNote();
      }, adjustedDuration);
    };

    playNextNote();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      setCurrentNoteIndex(-1);
    };
  }, [isPlaying, bpm, transposeValue, instrumentType, notes, instrumentRef]);

  return { currentNoteIndex, setCurrentNoteIndex };
};
