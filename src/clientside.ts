declare var Awesomplete: any;
let awesomplete;
let nameTranslations: {
  [key: string]: {
    [key: string]: string
  };
};
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
  var input = document.getElementById("cardNames");
  awesomplete = new Awesomplete(input);
  awesomplete.minChars = 1;
  awesomplete.autoFirst = true;
  input.addEventListener("awesomplete-selectcomplete", updateResult, true);
}
function updateAwesomplete(nameTranslations) {
  var cardOptions = getObjectKeys(nameTranslations);
  awesomplete.list = cardOptions;
}
function getObjectKeys(obj) {
  var keys = [];
  for (var key in obj)
    if (obj.hasOwnProperty(key))
      keys.push(key);
  return keys;
}
function getUrlTranslations(sourceLanguage) {
  return 'translations-' + sourceLanguage + '.json?v=#{version}' // version in url param just for enforce cache expiration
}
function clearTexts() {
  awesomplete.input.value = null;
  document.getElementById("result").textContent = null;
}
async function loadTranslations() {
  clearTexts();
  let sourceLanguage = (<HTMLSelectElement>document.getElementById("sourceLanguage")).value;
  console.log("Loading translations for " + sourceLanguage);
  let urlTranslations = getUrlTranslations(sourceLanguage);
  let jsFileContent = await fetch(urlTranslations);
  let data = await jsFileContent.json();
  nameTranslations = data;
  updateAwesomplete(nameTranslations);
  console.log("Loaded translations for " + sourceLanguage);
}
function onSourceLangChange() {
  loadTranslations();
}
function onTargetLangChange() {
  updateResult();
}
async function init() {
  initAwesomplete();
  document.getElementById("sourceLanguage").addEventListener("change", onSourceLangChange);
  await loadTranslations();
  document.getElementById("targetLanguage").addEventListener("change", onTargetLangChange);
}
init();
