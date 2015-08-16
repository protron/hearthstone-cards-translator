var jade = require('jade');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

var inputFileJson = "output/merged.min.json";
var inputFileJade = "autocomplete.jade";
var outputFileTranslations = "output/translations.js";
var outputFileOptions = "output/options.js";
var outputFileHtml = "output/autocomplete.htm";

function filterCards(parsedData) {
  return _.filter(parsedData, function(v) {
    return v.type !== 'Hero Power' && v.type !== 'Enchantment' && v.deckSet !==
      'Debug' && v.id.split('_')[0] !== 'GAME';
  });
}

function getNameTranslations(parsedData) {
  return _.reduce(parsedData, function(result, v, key) {
    var m = typeof v.name === 'string' ? [v.name, v.name] : _.values(v.name);
    result[m[1]] = m[0];
    return result;
  }, {});
}

function formatOutputOptions(optionNames) {
  return 'var cardOptions = ' + JSON.stringify(optionNames);
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

function compileJade() {
  console.log("Compiling: " + inputFileJade);
  var tempJadePath = path.resolve(__dirname, 'output', inputFileJade);
  copyFile(inputFileJade, tempJadePath, function() {
    var fn = jade.compileFile(tempJadePath, {});
    var html = fn();
    fs.writeFileSync(outputFileHtml, html);
    fs.unlinkSync(tempJadePath);
    console.log("DONE!");
  });
}

var state = {
  nameTranslations: null,

  on1stOutputReady: function() {
    var optionNames = _.keys(this.nameTranslations);
    writeToFile(outputFileOptions, formatOutputOptions(optionNames),
      compileJade);
  },

  readJsonInput: function(err, data) {
    if (err) throw err;
    var parsedData = JSON.parse(data);
    var cards = filterCards(parsedData);
    this.nameTranslations = getNameTranslations(cards);
    writeToFile(outputFileTranslations, formatOutputTranslations(
      this.nameTranslations), this.on1stOutputReady);
  }
};
_.bindAll(state, 'readJsonInput', 'on1stOutputReady')

console.log("Reading: " + inputFileJson);
fs.readFile(inputFileJson, state.readJsonInput);
