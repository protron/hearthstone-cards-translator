var fs = require('fs');
var _ = require('lodash');

var inputFile = "output/merged.min.json";
var outputFileTranslations = "output/translations.min.json";
var outputFileInputLangNames = "output/inputLangNames.min.json";

function filterCards(parsedData) {
  return _.filter(parsedData, function(v) {
    return v.type !== 'Hero Power' && v.type !== 'Enchantment' && v.deckSet !==
      'Debug' && v.id.split('_')[0] !== 'GAME';
  });
};

function getNameTranslations(parsedData) {
  return _.reduce(parsedData, function(result, v, key) {
    var m = typeof v.name === 'string' ? [v.name, v.name] : _.values(v.name);
    result[m[1]] = m[0];
    return result;
  }, {});
};

function writeToFile(filePath, content) {
  console.log("Writing: " + filePath);
  var stream = fs.createWriteStream(filePath);
  stream.once('open', function(fd) {
    stream.write(content);
    stream.end();
  });
}

console.log("Reading: " + inputFile);
fs.readFile(inputFile, function(err, data) {
  if (err) throw err;
  var parsedData = JSON.parse(data);
  var cards = filterCards(parsedData);
  var nameTranslations = getNameTranslations(cards);
  writeToFile(outputFileTranslations, JSON.stringify(nameTranslations));
  var optionNames = _.keys(nameTranslations);
  writeToFile(outputFileInputLangNames, JSON.stringify(optionNames));
  console.log("DONE!");
});
