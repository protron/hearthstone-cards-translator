import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { allLanguages, defaultSourceLanguage, defaultTargetLanguage } from '../settings.js';
import { AwesompleteInput } from './components/AwesompleteInput';
const LoadTranslation = (lang: string) => import(`../output/translations-${lang}.json`);

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
    // Clear the state when source language changes
    setTranslatedName('');
    setSelectedCard('');
    // Load new translations
    LoadTranslation(sourceLanguage).then(data => {
      setNameTranslations(data);
    });
  }, [sourceLanguage]);

  useEffect(() => {
    const translations = nameTranslations[selectedCard];
    if (!translations) {
      if (selectedCard !== '' && selectedCard !== null) {
        console.log(`No entry found for card '${selectedCard}'`);
      }
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
          className="rounded-xs outline-solid outline-1 outline-offset-4 outline-gray-500 tracking-normal"
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
  var selectClasses = "w-full rounded-xs outline-solid outline-1 outline-offset-4 outline-gray-500 tracking-wider"
  var optionsClasses = "text-gray-700 bg-gray-100"
  return (
    <tr>
      <td>Language</td>
      <td>
        <select 
          id="sourceLanguage"
          value={sourceLanguage}
          onChange={(e) => onSourceLanguageChange(e.target.value)}
          className={selectClasses}
        >
          {allLanguages.map((language) => (
            <option 
              key={language} 
              value={language}
              className={optionsClasses}
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
          className={selectClasses}
        >
          {allLanguages.map((language) => (
            <option 
              key={language} 
              value={language}
              className={optionsClasses}
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
    <>
      <h1 className="m-2 md:m-4 text-black text-2xl font-bold text-center">{title}</h1>
      <h2 className="m-1 md:m-2 text-gray-500 text-xs font-bold text-center">
        <a 
          href="https://hearthstonejson.com/" 
          target="_blank" 
          rel="noreferrer"
          className='text-gray-700 hover:text-gray-900 transition-colors hover:underline no-underline'
        >
          HearthstoneJSON
        </a>
        {" "}card names dated{" "}
        <span className="cards-updated text-gray-700">{import.meta.env.VITE_CARDS_LAST_UPDATE}</span>
      </h2>
    </>
  );
};

// Footer Component
const AppFooter: React.FC = () => {
  return (
    <footer className='text-gray-500 text-xs mt-4 flex flex-col gap-2 items-center'>
      <a href="https://github.com/protron" target="_blank" className='text-gray-700 hover:text-gray-900 transition-colors hover:underline no-underline'>
        Developed by Mariano Desanze
      </a>
      <div>
        Build Date:{" "}
        <span className="build-date text-gray-700">{import.meta.env.VITE_BUILD_TIMESTAMP}</span>
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