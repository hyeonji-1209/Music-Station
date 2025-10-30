import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './style/index.scss';
import * as Screens from './screens';
import { Header, Side } from './components';
import { SettingsModal } from './features/settings';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="App">
      <Header onProfileClick={() => setIsSettingsOpen(true)} />
      <BrowserRouter>
        <Side />
        <main className="App__main">
          <Routes>
            <Route path="/" element={<Screens.Home selectedInstrument="piano" />} />
            <Route path="/piano" element={<Screens.PianoPage />} />
            <Route path="/drum" element={<Screens.DrumPage />} />
            <Route path="/admin" element={<Screens.Admin selectedInstrument="piano" />} />
          </Routes>
        </main>
      </BrowserRouter>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
