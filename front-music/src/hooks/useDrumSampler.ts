import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

export const useDrumSampler = () => {
  const drumRef = useRef<Tone.Players | null>(null);

  useEffect(() => {
    drumRef.current = new Tone.Players({
      urls: {
        kick: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/kick.mp3",
        snare: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/snare.mp3",
        hihat: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/hihat.mp3",
      }
    }).toDestination();

    return () => {
      if (drumRef.current) {
        drumRef.current.disconnect();
        drumRef.current.dispose();
      }
    };
  }, []);

  return drumRef;
};
