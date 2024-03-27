import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises'
import { allLanguages } from "./settings.js"

var inputFileJson = "intermediate-assets/cards.json";

function getOutputFilePath(language) {
  return `output/translations-${language}.json`
}

function cardFilter(card) {
  return card.deckSet !== 'Debug' &&
    card.type !== 'Hero Power' &&
    card.type !== 'Enchantment' &&
    card.id.split('_')[0] !== 'GAME';
}

function getNameTranslations(parsedData, srcLanguage) {
  return parsedData.reduce(function(accumulator, currentValue) {
    var cardName = currentValue.name;
    if (!cardName)
      return accumulator;
    var key = cardName[srcLanguage];
    accumulator[key] = cardName;
    return accumulator;
  }, {});
}

async function generateFileForLanguage(cards, language) {
  var nameTranslations = getNameTranslations(cards, language);
  var jsonContent = JSON.stringify(nameTranslations);
  var outputPath = getOutputFilePath(language);
  console.log("Writing: " + outputPath);
  await writeFile(outputPath, jsonContent);
}

export default async function createSourceLangJsons() {
  console.log("Reading: " + inputFileJson);
  let fileContent = await readFile(inputFileJson, 'utf8');
  let parsedCardsJson = await JSON.parse(fileContent);
  let filteredCards = parsedCardsJson.filter(cardFilter);
  for (let language of allLanguages) {
    await generateFileForLanguage(filteredCards, language);
  }
  console.log(`Generated files for ${allLanguages.length} languages`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await createSourceLangJsons();
}
