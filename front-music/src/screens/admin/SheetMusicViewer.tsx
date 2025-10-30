import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Button } from '../../components';
import { OSMD_CONFIG } from '../../utils/osmd';

const SheetMusicViewer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const musicUrl = searchParams.get('url');

  useEffect(() => {
    if (!musicUrl) {
      setError('악보 URL이 제공되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadAndRenderSheet = async () => {
      if (!containerRef.current || !musicUrl) return;

      try {
        setIsLoading(true);
        setError('');

        // 기존 렌더링 완전히 제거
        if (osmdRef.current) {
          osmdRef.current.clear();
          osmdRef.current = null;
        }
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // MusicXML 파일 로드
        const response = await fetch(musicUrl);
        if (!response.ok) {
          throw new Error('악보 파일을 불러올 수 없습니다.');
        }

        const xmlText = await response.text();

        // 컴포넌트가 언마운트되었는지 확인
        if (!isMounted || !containerRef.current) return;

        // OpenSheetMusicDisplay로 렌더링
        osmdRef.current = new OpenSheetMusicDisplay(containerRef.current, OSMD_CONFIG);
        await osmdRef.current.load(xmlText);

        if (!isMounted || !containerRef.current) return;

        osmdRef.current.render();

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading MusicXML:', err);
        if (isMounted) {
          setError('악보를 로드하는 중 오류가 발생했습니다.');
          setIsLoading(false);
        }
      }
    };

    loadAndRenderSheet();

    // Cleanup 함수
    return () => {
      isMounted = false;
      if (osmdRef.current) {
        osmdRef.current.clear();
        osmdRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [musicUrl]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!musicUrl) {
    return (
      <div className="sheet-music-viewer">
        <div className="sheet-music-viewer__header">
          <Button variant="outline" onClick={handleBack}>
            ← 뒤로
          </Button>
        </div>
        <div className="sheet-music-viewer__error">
          <p>악보 URL이 제공되지 않았습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sheet-music-viewer">
      <div className="sheet-music-viewer__header">
        <Button variant="outline" onClick={handleBack}>
          ← 뒤로
        </Button>
      </div>

      <div className="sheet-music-viewer__content">
        {isLoading && (
          <div className="sheet-music-viewer__loading">
            <p>악보를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="sheet-music-viewer__error">
            <p>{error}</p>
          </div>
        )}

        <div
          ref={containerRef}
          className="sheet-music-viewer__container"
          style={{ display: isLoading || error ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
};

export default SheetMusicViewer;

