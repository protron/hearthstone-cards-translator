// npm start -- --skipdownload
var isSkipingDownload = process.argv[2] === '--skipdownload';

if (isSkipingDownload) {
  require('./format-html');
} else {
  global.onJsonsCreated = function() {
    require('./format-html');
  }
  global.onDownloadFinished = function() {
    require('./create-source-lang-jsons');
  }
  require('./fetch-cards-if-outdated');
}
