var pug = require('pug');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var pjson = require('./package.json');

var srcLanguage = 'esMX';
var allLanguages = [ "enUS", "frFR", "zhTW", "zhCN", "ruRU", "ptBR", "plPL", "koKR", "itIT", "esMX", "esES", "deDE", "enGB", "jaJP" ];

var inputFileJson = "output/cards.json";
var inputFileTemplate = "autocomplete.pug";
var outputFileTranslations = "output/translations.js";
var outputFileHtml = "output/autocomplete.htm";

function filterCards(parsedData) {
  return _.filter(parsedData, function(v) {
    return v.type !== 'Hero Power' && v.type !== 'Enchantment' && v.deckSet !==
      'Debug' && v.id.split('_')[0] !== 'GAME';
  });
}

function getNameTranslations(parsedData) {
  return _.reduce(parsedData, function(result, v, key) {
    if (!v.name)
      return result;
    var key = v.name[srcLanguage];
    var val = v.name;
    result[key] = val;
    return result;
  }, {});
}

function formatOutputTranslations(nameTranslations) {
  return 'var nameTranslations = ' + JSON.stringify(nameTranslations);
}

function writeToFile(filePath, content, done) {
  console.log("Writing: " + filePath);
  var stream = fs.createWriteStream(filePath);
  stream.once('open', function(fd) {
    stream.write(content);
    stream.end();
    done();
  });
}

function copyFile(input, output, done) {
  fs.createReadStream(input)
    .pipe(fs.createWriteStream(output))
    .on('finish', done);
}

function compileTemplate() {
  console.log("Compiling: " + inputFileTemplate);
  var tempTemplatePath = path.resolve(__dirname, 'output', inputFileTemplate);
  copyFile(inputFileTemplate, tempTemplatePath, function() {
    var fn = pug.compileFile(tempTemplatePath, {
      pretty: true
    });
    var html = fn({
      version: pjson.version,
      srcLanguage: srcLanguage,
      allLanguages: allLanguages
    });
    fs.writeFileSync(outputFileHtml, html);
    fs.unlinkSync(tempTemplatePath);
    console.log("DONE!");
  });
}

function readJsonInput(err, data) {
  if (err) throw err;
  var parsedData = JSON.parse(data);
  var cards = filterCards(parsedData);
  var nameTranslations = getNameTranslations(cards);
  writeToFile(outputFileTranslations, formatOutputTranslations(nameTranslations),
    compileTemplate);
}

console.log("Reading: " + inputFileJson);
fs.readFile(inputFileJson, readJsonInput);
