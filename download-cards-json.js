var request = require('request');
var fs = require('fs');

var urlToDownload = 'https://api.hearthstonejson.com/v1/latest/all/cards.json';
var outputPath = 'output/cards.json';

function onStart() {
  console.log('Downloading ' + urlToDownload + '...');
}

function onFinished() {
  console.log('Downloaded file: ' + outputPath);
  if (global.onDownloadFinished) {
    global.onDownloadFinished();
  }
}

function getWriteStream() {
  var ws = fs.createWriteStream(outputPath);
  ws.on('finish', onFinished);
  return ws;
}

function download() {
  onStart();
  request.get(urlToDownload).pipe(getWriteStream());
}

download();
