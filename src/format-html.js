var pug = require('pug');
var fs = require('fs');
var pjson = require('../package.json');

var defaultSourceLanguage = 'esMX';
var defaultTargetLanguage = 'enUS';

var inputFileTemplate = "src/autocomplete.pug";
var outputFileHtml = "output/autocomplete.htm";

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
    allLanguages: pjson.config.languages
  });
  fs.writeFileSync(outputFileHtml, html);
  console.log("DONE!");
}

compileTemplate();
