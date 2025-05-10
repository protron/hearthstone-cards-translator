import './globals.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { allLanguages, defaultSourceLanguage, defaultTargetLanguage } from '../settings.js';

// Card Name Input Component
const CardNameInputRow: React.FC = () => {
  return (
    <tr>
      <td>Card name</td>
      <td>
        <input 
          id="cardNames" 
          className="awesomplete" 
          placeholder="Card name to translate" 
          size={25} 
        />
      </td>
      <td>
        <div id="result"></div>
      </td>
    </tr>
  );
};

// Language Selector Component
const LanguageSelectorRow: React.FC = () => {
  const [sourceLanguage, setSourceLanguage] = useState(defaultSourceLanguage);
  const [targetLanguage, setTargetLanguage] = useState(defaultTargetLanguage);
  return (
    <tr>
      <td>Language</td>
      <td>
        <select 
          id="sourceLanguage"
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
        >
          {allLanguages.map((language) => (
            <option 
              key={language} 
              value={language}
            >
              {language}
            </option>
          ))}
        </select>
      </td>
      <td>
        <select 
          id="targetLanguage"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          {allLanguages.map((language) => (
            <option 
              key={language} 
              value={language}
            >
              {language}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
};

// Main Table Component
const MainTable: React.FC = () => {
  return (
    <table>
      <tbody>
        <LanguageSelectorRow />
        <CardNameInputRow />
      </tbody>
    </table>
  );
};

// Header Component
const AppHeader: React.FC = () => {
  const [title] = useState('Hearthstone Cards Translator');
  return (
    <div>
      <h1 className="text-3xl font-bold underline">{title}</h1>
      <h2>
        <a 
          href="https://hearthstonejson.com/" 
          target="_blank" 
          rel="noreferrer"
        >
          HearthstoneJSON
        </a>
        {" "}card names dated{" "}
        <span className="cardsUpdated">%CARDS_LAST_UPDATE%</span>
      </h2>
      <h3>
        Build Date:
        <span className="cardsUpdated">%VITE_BUILD_DATE%</span>
      </h3>
    </div>
  );
};

// Footer Component
const AppFooter: React.FC = () => {
  return (
    <footer>
      <a href="https://github.com/protron" target="_blank">
        Developed by Mariano Desanze
      </a>
    </footer>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <div className="main-wrapper">
      <AppHeader />
      <MainTable />
      <AppFooter />
    </div>
  );
};

// Render the App
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);