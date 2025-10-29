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
      <Side />
      <main className="App__main">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Screens.Home />} />
          </Routes>
        </BrowserRouter>
      </main>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
