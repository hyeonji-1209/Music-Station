import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

export const useBassSampler = () => {
  const bassRef = useRef<Tone.Sampler | null>(null);

  useEffect(() => {
    bassRef.current = new Tone.Sampler({
      urls: {
        C2: "C2.mp3", D2: "D2.mp3", E2: "E2.mp3", F2: "F2.mp3",
        G2: "G2.mp3", A2: "A2.mp3", B2: "B2.mp3", C3: "C3.mp3",
        D3: "D3.mp3", E3: "E3.mp3", F3: "F3.mp3", G3: "G3.mp3",
        A3: "A3.mp3", B3: "B3.mp3", C4: "C4.mp3"
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/"
    }).toDestination();

    return () => {
      if (bassRef.current) {
        bassRef.current.disconnect();
        bassRef.current.dispose();
      }
    };
  }, []);

  return bassRef;
};
