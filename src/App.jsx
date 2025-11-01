import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import PromptsLibrary from './pages/PromptsLibrary';
import Templates from './pages/Templates';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'prompts':
        return <PromptsLibrary />;
      case 'templates':
        return <Templates />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>🤖 GPT Builder</h1>
          <p>Build, architect, and export custom AI models with ease</p>
          <nav className="nav">
            <button
              className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              className={`nav-button ${currentPage === 'prompts' ? 'active' : ''}`}
              onClick={() => setCurrentPage('prompts')}
            >
              📝 Prompts Library
            </button>
            <button
              className={`nav-button ${currentPage === 'templates' ? 'active' : ''}`}
              onClick={() => setCurrentPage('templates')}
            >
              🎨 Templates
            </button>
          </nav>
        </div>
      </header>
      <main className="container">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
