import { pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';
import { compileFile } from 'pug';
import { CardsLastUpdateIO } from './cards-last-update-io.js';
import { allLanguages, defaultSourceLanguage, defaultTargetLanguage, 
  url_awesomplete_css, url_awesomplete_js } from "./settings.js"

var inputFileTemplate = "src/html-template.pug";
var outputFileHtml = "output/index.html";

export default async function compileHtml() {
  const cardsUpdateDate = await CardsLastUpdateIO.read();
  console.log(`Compiling: ${inputFileTemplate} (cardsUpdateDate: ${cardsUpdateDate})`);
  var fn = compileFile(inputFileTemplate, {
    pretty: true
  });
  var html = fn({
    cardsUpdateDate: cardsUpdateDate,
    allLanguages: allLanguages,
    defaultSourceLanguage: defaultSourceLanguage,
    defaultTargetLanguage: defaultTargetLanguage,
    url_awesomplete_css: url_awesomplete_css,
    url_awesomplete_js: url_awesomplete_js
  });
  writeFileSync(outputFileHtml, html);
  console.log(`HTML generated: ${outputFileHtml}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await compileHtml();
}
