/**
 * Transposes MusicXML by semitones
 */
export const transposeXML = (xmlText: string, semitones: number): string => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const pitches = xmlDoc.getElementsByTagName('pitch');
  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

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

  for (let i = 0; i < pitches.length; i++) {
    const pitch = pitches[i];
    const stepEl = pitch.getElementsByTagName('step')[0];
    const octaveEl = pitch.getElementsByTagName('octave')[0];
    const alterEl = pitch.getElementsByTagName('alter')[0];

    if (!stepEl || !octaveEl) continue;

    const step = stepEl.textContent || 'C';
    const octave = parseInt(octaveEl.textContent || '4');
    const alter = alterEl ? parseInt(alterEl.textContent || '0') : 0;

    const noteIndex = noteNames.indexOf(step);
    const stepsToC = [0, 2, 4, 5, 7, 9, 11][noteIndex];
    let totalSemitones = stepsToC + alter + (octave * 12) + semitones;

    const newOctave = Math.floor(totalSemitones / 12);
    const semitonesInOctave = ((totalSemitones % 12) + 12) % 12;
    const newNote = semitoneToNote[semitonesInOctave];

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

  return new XMLSerializer().serializeToString(xmlDoc);
};

/**
 * Key options with labels and semitone values
 */
export const keyOptions = [
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
