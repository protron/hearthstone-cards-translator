var fs = require('fs');
var _ = require('lodash');
var pjson = require('../package.json');

var inputFileJson = "intermediate-assets/cards.json";

function getOutputFilePath(language) {
  return `output/translations-${language}.json`
}

function filterCards(parsedData) {
  return _.filter(parsedData, function(v) {
    return v.type !== 'Hero Power' && v.type !== 'Enchantment' && v.deckSet !==
      'Debug' && v.id.split('_')[0] !== 'GAME';
  });
}

function getNameTranslations(parsedData, srcLanguage) {
  return _.reduce(parsedData, function(result, v, key) {
    if (!v.name)
      return result;
    var key = v.name[srcLanguage];
    var val = v.name;
    result[key] = val;
    return result;
  }, {});
}

async function writeToFile(filePath, content) {
  console.log("Writing: " + filePath);
  var stream = await fs.createWriteStream(filePath);
  stream.write(content);
  stream.end();
}

function generateFileForLanguage(cards, language) {
  var nameTranslations = getNameTranslations(cards, language);
  var jsonContent = JSON.stringify(nameTranslations);
  var outputPath = getOutputFilePath(language);
  writeToFile(outputPath, jsonContent);
}

async function createJsonFiles() {
  console.log("Reading: " + inputFileJson);
  let fileContent = await fs.promises.readFile(inputFileJson, 'utf8');
  let parsedCardsJson = await JSON.parse(fileContent);
  let filteredCards = filterCards(parsedCardsJson);
  let allLanguages = pjson.config.languages;
  for (let language of allLanguages) {
    generateFileForLanguage(filteredCards, language);
  }
  console.log(`Generated files for ${allLanguages.length} languages`);
}

async function run() {
  await createJsonFiles();
  if (global.onJsonsCreated) {
    global.onJsonsCreated();
  }
}

run();
