import React, { useState, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { InstrumentType } from '../components/layout/Side';
import { getInstrumentLabel } from '../utils/instruments';
import { ADMIN_OSMD_CONFIG } from '../utils/osmd';
import '../style/screens/Admin.scss';

interface AdminProps {
  selectedInstrument: InstrumentType;
}

const Admin: React.FC<AdminProps> = ({ selectedInstrument }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [xmlContent, setXmlContent] = useState<string>('');
  const [previewError, setPreviewError] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setPreviewError('');

    try {
      const text = await file.text();
      setXmlContent(text);

      // 악보 미리보기
      await renderMusicXML(text);
    } catch (error) {
      console.error('Error reading file:', error);
      setPreviewError('파일을 읽는 중 오류가 발생했습니다.');
    }
  };

  const renderMusicXML = async (xmlText: string) => {
    if (!containerRef.current) return;

    try {
      if (osmdRef.current) osmdRef.current.clear();
      containerRef.current.innerHTML = '';

      osmdRef.current = new OpenSheetMusicDisplay(containerRef.current, ADMIN_OSMD_CONFIG);
      await osmdRef.current.load(xmlText);
      osmdRef.current.render();

      setPreviewError('');
    } catch (error) {
      console.error('Error rendering MusicXML:', error);
      setPreviewError('악보를 렌더링하는 중 오류가 발생했습니다. MusicXML 형식이 올바른지 확인해주세요.');
    }
  };

  const handleSave = () => {
    if (!uploadedFile || !xmlContent) {
      alert('업로드된 파일이 없습니다.');
      return;
    }

    // 파일을 public/musicxml 폴더에 저장하는 로직
    // 실제로는 서버 API를 통해 저장해야 합니다
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedInstrument}_${uploadedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`${selectedInstrument} 악보가 저장되었습니다.`);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="admin">
      <div className="admin__container">
        <h1 className="admin__title">관리자 페이지 - 악보 업로드</h1>

        <div className="admin__instrument-info">
          <p>현재 선택된 악기: <strong>{getInstrumentLabel(selectedInstrument)}</strong></p>
        </div>

        <div className="admin__upload-section">
          <h2 className="admin__section-title">MusicXML 파일 업로드</h2>
          <p className="admin__description">
            MusicXML (.xml 또는 .musicxml) 파일을 업로드하면 자동으로 악보가 표시됩니다.
          </p>

          <div className="admin__upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xml,.musicxml"
              onChange={handleFileUpload}
              className="admin__file-input"
              id="file-upload"
            />
            <button onClick={handleBrowseClick} className="admin__browse-button">
              파일 선택
            </button>
            {uploadedFile && (
              <span className="admin__file-name">{uploadedFile.name}</span>
            )}
          </div>

          {uploadedFile && (
            <button onClick={handleSave} className="admin__save-button">
              악보 저장
            </button>
          )}
        </div>

        {previewError && (
          <div className="admin__error">
            {previewError}
          </div>
        )}

        {xmlContent && !previewError && (
          <div className="admin__preview-section">
            <h2 className="admin__section-title">악보 미리보기</h2>
            <div className="admin__preview">
              <div ref={containerRef} id="admin-osmd-container" />
            </div>
          </div>
        )}

        {xmlContent && (
          <div className="admin__xml-section">
            <h2 className="admin__section-title">XML 내용</h2>
            <textarea
              className="admin__xml-viewer"
              value={xmlContent}
              readOnly
              rows={15}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
