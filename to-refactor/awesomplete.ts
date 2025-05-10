import Awesomplete from "awesomplete";

let nameTranslations: {
  [key: string]: {
    [key: string]: string
  };
};

let awesomplete: Awesomplete;

function updateResult() {
  let translatedName = '';
  const selectedCard = awesomplete.input.value;
  if (selectedCard) {
    const translations = nameTranslations[selectedCard];
    if (!translations) {
      console.log(`No entry found for card '${selectedCard}'`);
    } else {
      const selectedTargetLang = (<HTMLSelectElement>document.getElementById("targetLanguage")).value;
      translatedName = translations[selectedTargetLang];
      if (!translatedName) {
        console.log(`Card '${selectedCard}' found for other languages but not this one.`, translations);
      }
    }
  }
  document.getElementById("result").innerText = translatedName;
}

function initAwesomplete() {
  const input = document.getElementById("cardNames") as HTMLInputElement;
  awesomplete = new Awesomplete(input, {
    minChars: 1,
    autoFirst: true
  });
  input.addEventListener("awesomplete-selectcomplete", updateResult, true);
}

function updateAwesomplete(nameTranslations: { [key: string]: { [key: string]: string } }) {
  const cardOptions = getObjectKeys(nameTranslations);
  awesomplete.list = cardOptions;
}

function getObjectKeys(obj: { [key: string]: any }): string[] {
  return Object.keys(obj);
}

function getUrlTranslations(sourceLanguage: string): string {
  return `translations-${sourceLanguage}.json?v=#{version}`; // version in url param just for enforce cache expiration
}

function clearTexts() {
  awesomplete.input.value = '';
  document.getElementById("result").textContent = '';
}

async function loadTranslations() {
  clearTexts();
  const sourceLanguage = (<HTMLSelectElement>document.getElementById("sourceLanguage")).value;
  const response = await fetch(getUrlTranslations(sourceLanguage));
  nameTranslations = await response.json();
  updateAwesomplete(nameTranslations);
}

function onSourceLangChange() {
  loadTranslations();
}

function onTargetLangChange() {
  updateResult();
}

function init() {
  initAwesomplete();
  document.getElementById("sourceLanguage").addEventListener("change", onSourceLangChange);
  document.getElementById("targetLanguage").addEventListener("change", onTargetLangChange);
  loadTranslations();
}

init();
