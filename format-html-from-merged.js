var jade = require('jade');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var pjson = require('./package.json');

var inputFileJson = "output/merged.min.json";
var inputFileJade = "autocomplete.jade";
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
    var m = typeof v.name === 'string' ? [v.name, v.name] : _.values(v.name);
    result[m[1]] = m[0];
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

function compileJade() {
  console.log("Compiling: " + inputFileJade);
  var tempJadePath = path.resolve(__dirname, 'output', inputFileJade);
  copyFile(inputFileJade, tempJadePath, function() {
    var fn = jade.compileFile(tempJadePath, {
      pretty: true
    });
    var html = fn({
      version: pjson.version
    });
    fs.writeFileSync(outputFileHtml, html);
    fs.unlinkSync(tempJadePath);
    console.log("DONE!");
  });
}

function readJsonInput(err, data) {
  if (err) throw err;
  var parsedData = JSON.parse(data);
  var cards = filterCards(parsedData);
  var nameTranslations = getNameTranslations(cards);
  writeToFile(outputFileTranslations, formatOutputTranslations(nameTranslations),
    compileJade);
}

console.log("Reading: " + inputFileJson);
fs.readFile(inputFileJson, readJsonInput);
