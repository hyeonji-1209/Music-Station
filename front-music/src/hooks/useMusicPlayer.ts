import { useState, useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { OSMD_CONFIG } from '../utils/osmd';

interface UseMusicPlayerProps {
  musicXmlPath: string;
  instrumentType: 'piano' | 'drum';
}

export const useMusicPlayer = ({ musicXmlPath, instrumentType }: UseMusicPlayerProps) => {
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const isMountedRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);

  useEffect(() => {
    isMountedRef.current = true;

    const loadMusicXML = async () => {
      if (!isMountedRef.current) return;

      const container = document.getElementById('osmd-container');
      if (!container) {
        console.error('osmd-container not found');
        return;
      }

      // 기존 OSMD 인스턴스 완전히 정리
      if (osmdRef.current) {
        try {
          osmdRef.current.clear();
          osmdRef.current = null;
        } catch (e) {
          console.log('Error clearing OSMD:', e);
        }
      }

      // 컨테이너 완전히 클리어
      container.innerHTML = '';

      try {
        console.log(`Loading ${instrumentType} MusicXML...`);

        const osmd = new OpenSheetMusicDisplay(container, OSMD_CONFIG);
        await osmd.load(musicXmlPath);

        if (!isMountedRef.current) return;

        osmd.render();
        console.log('OSMD rendered');

        if (!isMountedRef.current) return;

        osmdRef.current = osmd;
      } catch (error) {
        console.error(`Error loading ${instrumentType} MusicXML:`, error);
      }
    };

    const timeoutId = setTimeout(loadMusicXML, 200);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutId);

      if (osmdRef.current) {
        try {
          osmdRef.current.clear();
        } catch (e) {
          console.log('Error clearing OSMD on cleanup:', e);
        }
        osmdRef.current = null;
      }
    };
  }, [musicXmlPath, instrumentType]);

  return {
    osmdRef,
    isPlaying,
    setIsPlaying,
    currentNoteIndex,
    setCurrentNoteIndex,
  };
};
