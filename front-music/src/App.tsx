import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './style/index.scss';
import * as Screens from './screens';
import { Header, Side } from './components';
import SettingsModal from './components/ui/SettingsModal';

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminPage && (
        <Header onProfileClick={() => setIsSettingsOpen(true)} />
      )}
      <main className={`App__main ${isAdminPage ? 'App__main--admin' : 'App__main--normal'}`}>
        {isAdminPage ? (
          <Routes>
            <Route path="/admin" element={<Screens.AdminDashboard />} />
            <Route path="/admin/upload" element={<Screens.Admin selectedInstrument="piano" />} />
            <Route path="/admin/sheet-music" element={<Screens.SheetMusicViewer />} />
          </Routes>
        ) : (
          <>
            <Side />
            <Routes>
              <Route path="/" element={<Screens.Home selectedInstrument="piano" />} />
              <Route path="/piano" element={<Screens.PianoPage />} />
              <Route path="/drum" element={<Screens.DrumPage />} />
              <Route path="/bass" element={<Screens.BassPage />} />
              <Route path="/guitar" element={<Screens.GuitarPage />} />
            </Routes>
          </>
        )}
      </main>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
