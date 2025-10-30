import { useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { OSMD_CONFIG } from '../utils/osmd';
import { transposeXML } from '../utils/xmlTranspose';

interface UseOSMDLoaderProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  xmlPath: string;
  transposeValue: number;
  shouldTranspose: boolean;
}

export const useOSMDLoader = ({
  containerRef,
  xmlPath,
  transposeValue,
  shouldTranspose
}: UseOSMDLoaderProps) => {
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);

  useEffect(() => {
    const loadAndRenderSheet = async () => {
      if (!containerRef.current) return;

      try {
        if (osmdRef.current) {
          osmdRef.current.clear();
        }
        containerRef.current.innerHTML = '';

        osmdRef.current = new OpenSheetMusicDisplay(containerRef.current, OSMD_CONFIG);

        const response = await fetch(xmlPath);
        let xmlText = await response.text();

        if (transposeValue !== 0 && shouldTranspose) {
          xmlText = transposeXML(xmlText, transposeValue);
        }

        await osmdRef.current.load(xmlText);
        osmdRef.current.render();
      } catch (error) {
        console.error('Error loading MusicXML:', error);
      }
    };

    loadAndRenderSheet();

    return () => {
      if (osmdRef.current) {
        osmdRef.current.clear();
      }
    };
  }, [containerRef, xmlPath, transposeValue, shouldTranspose]);

  return osmdRef;
};
