import React, { useState } from 'react';
import Piano from '../components/Piano';
import DrumKit from '../components/DrumKit';
import { BpmControl, DrumLegend } from '../components/music';
import { InstrumentType } from '../components/layout/Side';
import { getInstrumentLabel } from '../utils/instruments';
import { keyOptions } from '../utils/xmlTranspose';
import { getTransposedNote } from '../utils/music';
import { usePianoSampler } from '../hooks/usePianoSampler';
import { useDrumSampler } from '../hooks/useDrumSampler';
import { useOSMDLoader } from '../hooks/useOSMDLoader';
import { useScoreHighlight } from '../hooks/useScoreHighlight';
import { usePlayback } from '../hooks/usePlayback';
import { TWINKLE_NOTES_HOME, DRUM_NOTES } from '../constants/notes';

interface HomeProps {
  selectedInstrument: InstrumentType;
}

const Home: React.FC<HomeProps> = ({ selectedInstrument }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [transposeValue, setTransposeValue] = useState(0);
  const [bpm, setBpm] = useState(120);

  const pianoRef = usePianoSampler();
  const drumRef = useDrumSampler();

  const isDrum = selectedInstrument === 'drum';
  const xmlPath = isDrum ? '/musicxml/drum.xml' : '/musicxml/twinkle.xml';
  const notes = isDrum ? DRUM_NOTES : TWINKLE_NOTES_HOME;
  const instrumentRef = isDrum ? drumRef : pianoRef;

  const containerRef = useScoreHighlight(
    usePlayback({
      isPlaying,
      bpm,
      transposeValue,
      instrumentType: isDrum ? 'drum' : 'piano',
      notes,
      instrumentRef
    }).currentNoteIndex
  );

  useOSMDLoader({
    containerRef,
    xmlPath,
    transposeValue,
    shouldTranspose: !isDrum
  });

  const { currentNoteIndex } = usePlayback({
    isPlaying,
    bpm,
    transposeValue,
    instrumentType: isDrum ? 'drum' : 'piano',
    notes,
    instrumentRef
  });

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentKey = keyOptions.find(k => k.value === transposeValue)?.label || 'C (도)';

  return (
    <div className="home">
      <div className="home__container">
        <h1 className="home__title">
          반짝반짝 작은별 - {getInstrumentLabel(selectedInstrument)}
        </h1>

        <div className="home__controls">
          {!isDrum && (
            <div className="home__key-selector">
              <label className="home__label">
                키 선택:
                <select
                  className="home__select"
                  value={transposeValue}
                  onChange={(e) => setTransposeValue(parseInt(e.target.value))}
                >
                  {keyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <BpmControl bpm={bpm} onBpmChange={setBpm} />

          <button className="home__play-button" onClick={handlePlayPause}>
            {isPlaying ? '⏸ 정지' : '▶ 재생'}
          </button>
        </div>

        {isDrum && <DrumLegend />}

        <div className="musical-staff">
          <div ref={containerRef} id="osmd-container" />
        </div>

        {selectedInstrument === 'piano' && (
          <Piano
            activeNote={
              currentNoteIndex >= 0
                ? getTransposedNote(TWINKLE_NOTES_HOME[currentNoteIndex].note!, transposeValue)
                : undefined
            }
          />
        )}

        {isDrum && (
          <DrumKit
            activeDrum={currentNoteIndex >= 0 ? DRUM_NOTES[currentNoteIndex].drum : undefined}
          />
        )}

        <div className="home__info">
          {!isDrum && <p>현재 키: {currentKey}</p>}
          <p>BPM: {bpm}</p>
          <p>재생 중: {isPlaying ? '예' : '아니오'}</p>
          {currentNoteIndex >= 0 && selectedInstrument === 'piano' && (
            <p>현재 음표: {TWINKLE_NOTES_HOME[currentNoteIndex].note}</p>
          )}
          {currentNoteIndex >= 0 && isDrum && (
            <p>현재 드럼: {DRUM_NOTES[currentNoteIndex].drum}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
