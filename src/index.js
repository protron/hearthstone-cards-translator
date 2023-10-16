// npm start -- --skipdownload
var isSkipingDownload = process.argv[2] === '--skipdownload';

if (isSkipingDownload) {
  require('./format-html');
} else {
  global.onDownloadFinished = function() {
    require('./format-html');
  }
  require('./download-cards-json');
}
