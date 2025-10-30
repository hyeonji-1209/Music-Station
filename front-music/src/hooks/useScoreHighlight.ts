import { useEffect, useRef } from 'react';

/**
 * Hook to highlight current note in the musical score
 */
export const useScoreHighlight = (currentNoteIndex: number) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const allNotes = containerRef.current.querySelectorAll('.vf-stavenote');

    // Reset all notes to default color
    allNotes.forEach((note) => {
      (note as SVGElement).style.fill = '#000';
      (note as SVGElement).style.stroke = '#000';
    });

    // Highlight current note
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

  return containerRef;
};
