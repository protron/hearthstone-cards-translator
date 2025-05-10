import fetchCardsIfOutdated from './fetch-cards-if-outdated.js';
import createSourceLangJsons from './create-source-lang-jsons.js';
import compileHtml from '../src/compile-html.js';

const skipDownload = process.argv[2] === '--skipdownload';
const compileIfNeeded = process.argv[2] === '--compileifneeded';
const haveNewVersion = skipDownload ? false :
  await fetchCardsIfOutdated();
if (haveNewVersion) {
  await createSourceLangJsons();
}
if (haveNewVersion || skipDownload || !compileIfNeeded) {
  await compileHtml();
}
