const axios = require('axios').default;
const fs = require('fs');
const stream = require('stream');
const util = require('util');
var pjson = require('../package.json');

const urlToDownload = pjson.config.url_hearthstonejson_allcards;
const outputPath = 'intermediate-assets/cards.json';

function onStart() {
  console.log('Downloading ' + urlToDownload + '...');
}

function onFinished() {
  console.log('Downloaded file: ' + outputPath);
  if (global.onDownloadFinished) {
    global.onDownloadFinished();
  }
}

// downloadFile from https://stackoverflow.com/a/61269447/146513
const finished = util.promisify(stream.finished);
function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);
  return axios.get(fileUrl, {
    responseType: 'stream',
  }).then(async response => {
    response.data.pipe(writer);
    return finished(writer);
  });
}

function download() {
  onStart();
  downloadFile(urlToDownload, outputPath).then(onFinished);
}

download();
