import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/layout/AdminPageLayout';
import { Button, Checkbox, TabItem, TableColumn, DeleteModal } from '../../components';
import { useTableSelection } from '../../hooks/useTableSelection';
import { getInstrumentLabel } from '../../utils/labels';
import { mockMusicData, MusicItem } from '../../constants/mockData';

export type MusicInstrument = 'piano' | 'drum' | 'bass' | 'guitar' | 'vocal' | 'all';

const MusicManagement: React.FC = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<MusicInstrument>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [musicData, setMusicData] = useState<MusicItem[]>(mockMusicData.all);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const {
    selectedIds,
    selectedCount,
    hasSelection,
    isSelected,
    handleSelectAll,
    handleSelectOne,
    clearSelection,
  } = useTableSelection<MusicItem>(musicData);

  const handleInstrumentChange = (instrument: MusicInstrument) => {
    setSelectedInstrument(instrument);
    setMusicData(mockMusicData[instrument] || []);
    clearSelection();
  };

  const handleDeleteClick = () => {
    if (hasSelection) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirmed = async () => {
    setIsDeleting(true);
    // TODO: 실제 삭제 API 호출
    await new Promise(resolve => setTimeout(resolve, 500));

    const selectedArray = Array.from(selectedIds);
    const newData = musicData.filter(item => !selectedArray.includes(item.id));
    setMusicData(newData);
    clearSelection();
    setIsDeleteModalOpen(false);
    setIsDeleting(false);
  };

  const handleViewMusic = (musicXmlUrl: string) => {
    navigate(`/admin/sheet-music?url=${encodeURIComponent(musicXmlUrl)}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/xml' || file.name.endsWith('.xml') || file.name.endsWith('.musicxml')) {
        setUploadedFile(file);
      } else {
        alert('MusicXML 파일만 업로드 가능합니다.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (!uploadedFile) {
      alert('파일을 선택해주세요.');
      return;
    }
    // TODO: 실제 업로드 로직 구현
    console.log('Uploading file:', uploadedFile.name);
    alert(`${uploadedFile.name} 파일이 업로드되었습니다.`);
    setUploadedFile(null);
    setIsUploadModalOpen(false);
  };

  const instrumentTabs: TabItem[] = [
    { id: 'all', label: '전체' },
    { id: 'piano', label: '피아노' },
    { id: 'drum', label: '드럼' },
    { id: 'bass', label: '베이스' },
    { id: 'guitar', label: '기타' },
    { id: 'vocal', label: '보컬' },
  ].map(tab => ({
    ...tab,
    content: null,
  }));

  const columns: TableColumn<MusicItem>[] = [
    {
      key: 'checkbox',
      label: '',
      width: '50px',
      align: 'center',
      render: (row) => (
        <span onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected(row.id)}
            onChange={() => handleSelectOne(row.id)}
          />
        </span>
      ),
    },
    {
      key: 'id',
      label: 'ID',
      width: '80px',
      align: 'center',
    },
    {
      key: 'instrument',
      label: '악기',
      width: '120px',
      render: (row) => getInstrumentLabel(row.instrument),
    },
    {
      key: 'artist',
      label: '가수',
      width: '200px',
    },
    {
      key: 'title',
      label: '제목',
      render: (row) => (
        <span
          className="music-management__title-link"
          onClick={(e) => {
            e.stopPropagation();
            handleViewMusic(row.musicXmlUrl);
          }}
          title="악보보기"
        >
          {row.title}
        </span>
      ),
    },
  ];

  const rightActions = (
    <div className="music-management__actions">
      <button
        className="admin-btn admin-btn--primary"
        onClick={() => setIsUploadModalOpen(true)}
      >
        악보 등록
      </button>
      <button
        className="admin-btn admin-btn--outline"
        onClick={handleDeleteClick}
        disabled={!hasSelection}
      >
        삭제 ({selectedCount})
      </button>
    </div>
  );

  return (
    <div className="music-management admin-page">
      <AdminPageLayout
        tabs={instrumentTabs}
        activeTab={selectedInstrument}
        onTabChange={(tabId) => handleInstrumentChange(tabId as MusicInstrument)}
        rightActions={rightActions}
        columns={columns}
        data={musicData}
        keyExtractor={(music) => music?.id || 0}
        showSelectAll={true}
        selectedItems={selectedIds}
        onSelectAll={handleSelectAll}
        emptyMessage="등록된 악보가 없습니다."
      />

      {isUploadModalOpen && (
        <div className="music-management__modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="music-management__modal" onClick={(e) => e.stopPropagation()}>
            <div className="music-management__modal-header">
              <h2>악보 등록</h2>
              <Button
                variant="ghost"
                size="small"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadedFile(null);
                  setIsDragging(false);
                }}
                className="music-management__modal-close"
              >
                ×
              </Button>
            </div>
            <div className="music-management__modal-content">
              <div className="music-management__upload-section">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xml,.musicxml"
                  onChange={handleFileSelect}
                  className="music-management__file-input"
                />

                <div
                  className={`music-management__drop-zone ${isDragging ? 'music-management__drop-zone--dragging' : ''} ${uploadedFile ? 'music-management__drop-zone--has-file' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleFileInputClick}
                >
                  {uploadedFile ? (
                    <div className="music-management__file-info">
                      <span className="music-management__file-icon">📄</span>
                      <div className="music-management__file-details">
                        <span className="music-management__file-name">{uploadedFile.name}</span>
                        <span className="music-management__file-size">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        className="music-management__file-remove"
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="music-management__drop-icon">📤</div>
                      <p className="music-management__drop-text">
                        파일을 드래그하거나 클릭하여 업로드
                      </p>
                      <p className="music-management__drop-hint">
                        MusicXML (.xml, .musicxml) 파일만 가능
                      </p>
                    </>
                  )}
                </div>

                <div className="music-management__modal-actions">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      setUploadedFile(null);
                      setIsDragging(false);
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpload}
                    disabled={!uploadedFile}
                  >
                    등록
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
        title="삭제 확인"
        message={`${selectedCount}개의 악보를 삭제하시겠습니까?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MusicManagement;

