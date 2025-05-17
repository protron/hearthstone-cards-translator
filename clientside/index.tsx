import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { allLanguages, defaultSourceLanguage, defaultTargetLanguage } from '../settings.js';
import { AwesompleteInput } from './components/AwesompleteInput';
import hardcodedTranslations from '../output/translations-esMX.json';

// Main Table Component
const MainTable: React.FC = () => {
  const [sourceLanguage, setSourceLanguage] = useState(defaultSourceLanguage);
  const [targetLanguage, setTargetLanguage] = useState(defaultTargetLanguage);
  const [nameTranslations, setNameTranslations] = useState<{[key: string]: {[key: string]: string}}>({});
  const [translatedName, setTranslatedName] = useState('');
  const [selectedCard, setSelectedCard] = useState('');

  const handleCardSelect = (selectedCard: string) => {
    setSelectedCard(selectedCard);
  };

  useEffect(() => {
    const loadTranslations = async () => {
      //const url = `translations-${sourceLanguage}.json`;
      //const response = await fetch(url);
      //const data = await response.json();
      const data = hardcodedTranslations;
      setNameTranslations(data);
      setTranslatedName(''); // Clear translated name when language changes
      setSelectedCard(''); // Clear selected card when language changes
    };

    loadTranslations();
  }, [sourceLanguage]); // Reload translations when source language changes

  useEffect(() => {
    const translations = nameTranslations[selectedCard];
    if (!translations) {
      console.log(`No entry found for card '${selectedCard}'`);
      setTranslatedName('');
      return;
    }

    const translated = translations[targetLanguage];
    if (!translated) {
      console.log(`Card '${selectedCard}' found for other languages but not this one.`, translations);
      setTranslatedName('');
      return;
    }

    setTranslatedName(translated);
  }, [selectedCard, targetLanguage, nameTranslations]);

  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>Source</th>
          <th>Target</th>
        </tr>
        <LanguageSelectorRow 
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          onSourceLanguageChange={setSourceLanguage}
          onTargetLanguageChange={setTargetLanguage}
        />
        <CardNameInputRow 
          nameTranslations={nameTranslations}
          translatedName={translatedName}
          onCardSelect={handleCardSelect}
        />
      </tbody>
    </table>
  );
};

// Card Name Input Component
const CardNameInputRow: React.FC<{
  nameTranslations: {[key: string]: {[key: string]: string}};
  translatedName: string;
  onCardSelect: (selectedCard: string) => void;
}> = ({ nameTranslations, translatedName, onCardSelect }) => {
  return (
    <tr>
      <td>Card name</td>
      <td>
        <AwesompleteInput
          nameTranslations={nameTranslations}
          onSelect={onCardSelect}
        />
      </td>
      <td>
        <div id="result">{translatedName}</div>
      </td>
    </tr>
  );
};

// Language Selector Component
const LanguageSelectorRow: React.FC<{
  sourceLanguage: string;
  targetLanguage: string;
  onSourceLanguageChange: (lang: string) => void;
  onTargetLanguageChange: (lang: string) => void;
}> = ({ sourceLanguage, targetLanguage, onSourceLanguageChange, onTargetLanguageChange }) => {
  return (
    <tr>
      <td>Language</td>
      <td>
        <select 
          id="sourceLanguage"
          value={sourceLanguage}
          onChange={(e) => onSourceLanguageChange(e.target.value)}
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
          onChange={(e) => onTargetLanguageChange(e.target.value)}
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

// Header Component
const AppHeader: React.FC = () => {
  const [title] = useState('Hearthstone Cards Translator');
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <h2>
        <a 
          href="https://hearthstonejson.com/" 
          target="_blank" 
          rel="noreferrer"
        >
          HearthstoneJSON
        </a>
        {" "}card names dated{" "}
        <span className="cardsUpdated">{import.meta.env.VITE_CARDS_LAST_UPDATE}</span>
      </h2>
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
      <div className="buildDate">
        Build Date:
        <span className="cardsUpdated">{import.meta.env.VITE_BUILD_TIMESTAMP}</span>
      </div>
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