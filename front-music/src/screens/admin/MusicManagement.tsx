import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabItem, Table, TableColumn, Button, Checkbox } from '../../components';
import '../../style/screens/admin/MusicManagement.scss';

export type MusicInstrument = 'piano' | 'drum' | 'bass' | 'guitar' | 'vocal' | 'all';

interface MusicItem {
  id: number;
  instrument: MusicInstrument;
  artist: string;
  title: string;
  musicXmlUrl: string;
}

const mockMusicData: Record<MusicInstrument, MusicItem[]> = {
  all: [
    { id: 1, instrument: 'piano', artist: '바하', title: '평균율 클라비어곡집', musicXmlUrl: '/musicxml/twinkle.xml' },
    { id: 2, instrument: 'drum', artist: '드럼 마스터', title: '기본 드럼 리듬', musicXmlUrl: '/musicxml/drum.xml' },
    { id: 3, instrument: 'piano', artist: '모차르트', title: '피아노 소나타', musicXmlUrl: '/musicxml/twinkle.xml' },
    { id: 4, instrument: 'guitar', artist: '기타리스트', title: '기타 연주곡', musicXmlUrl: '/musicxml/twinkle.xml' },
  ],
  piano: [
    { id: 1, instrument: 'piano', artist: '바하', title: '평균율 클라비어곡집', musicXmlUrl: '/musicxml/twinkle.xml' },
    { id: 3, instrument: 'piano', artist: '모차르트', title: '피아노 소나타', musicXmlUrl: '/musicxml/twinkle.xml' },
  ],
  drum: [
    { id: 2, instrument: 'drum', artist: '드럼 마스터', title: '기본 드럼 리듬', musicXmlUrl: '/musicxml/drum.xml' },
  ],
  bass: [],
  guitar: [
    { id: 4, instrument: 'guitar', artist: '기타리스트', title: '기타 연주곡', musicXmlUrl: '/musicxml/twinkle.xml' },
  ],
  vocal: [],
};

const instrumentLabels: Record<MusicInstrument, string> = {
  all: '전체',
  piano: '피아노',
  drum: '드럼',
  bass: '베이스',
  guitar: '기타',
  vocal: '보컬',
};

const MusicManagement: React.FC = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<MusicInstrument>('all');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [musicData, setMusicData] = useState<MusicItem[]>(mockMusicData.all);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleInstrumentChange = (instrument: MusicInstrument) => {
    setSelectedInstrument(instrument);
    setMusicData(mockMusicData[instrument] || []);
    setSelectedRows(new Set());
    setIsAllSelected(false);
  };

  const handleDeleteClick = () => {
    if (selectedRows.size === 0) return;
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (selectedRows.size === 0) return;
    const newData = musicData.filter(item => !selectedRows.has(item.id));
    setMusicData(newData);
    setSelectedRows(new Set());
    setIsAllSelected(false);
    setIsDeleteModalOpen(false);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(musicData.map(item => item.id));
      setSelectedRows(allIds);
      setIsAllSelected(true);
    } else {
      setSelectedRows(new Set());
      setIsAllSelected(false);
    }
  };

  const handleRowSelect = (rowId: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
      setIsAllSelected(false);
    }
    setSelectedRows(newSelected);

    // 모든 항목이 선택되었는지 확인
    if (newSelected.size === musicData.length && musicData.length > 0) {
      setIsAllSelected(true);
    }
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
            checked={selectedRows.has(row.id)}
            onChange={(checked) => handleRowSelect(row.id, checked)}
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
      render: (row) => instrumentLabels[row.instrument] || row.instrument,
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

  return (
    <div className="music-management">
      <div className="music-management__tabs">
        <Tabs
          items={instrumentTabs}
          activeTab={selectedInstrument}
          onChange={(tabId) => handleInstrumentChange(tabId as MusicInstrument)}
          rightActions={
            <div className="admin-actions">
              <button
                className="admin-btn admin-btn--primary"
                onClick={() => setIsUploadModalOpen(true)}
              >
                악보 등록
              </button>
              <button
                className="admin-btn admin-btn--outline"
                onClick={handleDeleteClick}
                disabled={selectedRows.size === 0}
              >
                삭제
              </button>
            </div>
          }
        />
      </div>

      <div className="music-management__table">
        <Table
          columns={columns}
          data={musicData}
          keyExtractor={(row) => row.id}
          emptyMessage="등록된 악보가 없습니다."
          className="table--compact"
          showSelectAll={true}
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
        />
      </div>

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

      {isDeleteModalOpen && (
        <div className="music-management__modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="music-management__modal music-management__modal--delete" onClick={(e) => e.stopPropagation()}>
            <div className="music-management__modal-header">
              <h2>삭제 확인</h2>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsDeleteModalOpen(false)}
                className="music-management__modal-close"
              >
                ×
              </Button>
            </div>
            <div className="music-management__modal-content">
              <div className="music-management__delete-message">
                <p className="music-management__delete-text">
                  선택된 <strong>{selectedRows.size}개</strong>의 악보를 삭제하시겠습니까?
                </p>
                <p className="music-management__delete-warning">
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
              <div className="music-management__modal-actions">
                <Button
                  variant="secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  취소
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteConfirmed}
                >
                  삭제
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicManagement;

