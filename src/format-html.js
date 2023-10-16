var pug = require('pug');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var pjson = require('../package.json');

var defaultSourceLanguage = 'esMX';
var defaultTargetLanguage = 'enUS';
var allLanguages = [ "enUS", "esMX", "esES", "frFR", "zhTW", "zhCN", "ruRU", "ptBR", "plPL", "koKR", "itIT", "deDE", "enGB", "jaJP" ];

var inputFileTemplate = "src/autocomplete.pug";
var inputFileJson = "intermediate-assets/cards.json";
var outputFileHtml = "output/autocomplete.htm";

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

function writeToFile(filePath, content, done) {
  console.log("Writing: " + filePath);
  var stream = fs.createWriteStream(filePath);
  stream.once('open', function(fd) {
    stream.write(content);
    stream.end();
    if (done) done();
  });
}

function compileTemplate() {
  console.log("Compiling: " + inputFileTemplate);
  var fn = pug.compileFile(inputFileTemplate, {
    pretty: true
  });
  var html = fn({
    version: pjson.version,
    url_awesomplete_css: pjson.config.url_awesomplete_css,
    url_awesomplete_js: pjson.config.url_awesomplete_js,
    defaultSourceLanguage: defaultSourceLanguage,
    defaultTargetLanguage: defaultTargetLanguage,
    allLanguages: allLanguages
  });
  fs.writeFileSync(outputFileHtml, html);
  console.log("DONE!");
}

function readJsonInput(err, data) {
  if (err) throw err;
  var parsedData = JSON.parse(data);
  var cards = filterCards(parsedData);
  for (let language of allLanguages) {
    var nameTranslations = getNameTranslations(cards, language);
    var json = JSON.stringify(nameTranslations);
    writeToFile(`output/translations-${language}.js`, json);
  }
  compileTemplate();
}

console.log("Reading: " + inputFileJson);
fs.readFile(inputFileJson, readJsonInput);
