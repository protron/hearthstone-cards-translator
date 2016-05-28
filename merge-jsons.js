var request = require('request');
var fs = require('fs');
var AdmZip = require('adm-zip');
var _ = require('lodash');

// npm start -- --skipdownload
var isSkipingDownload = process.argv[2] === '--skipdownload';
var allLanguages = ["enUS", "frFR", "zhTW", "zhCN", "ruRU", "ptBR", "plPL",
  "koKR", "itIT", "esMX", "esES", "deDE", "enGB", "jaJP"];
var languages = ['enUS', 'esMX'];

var zipsPattern = "AllSets.{0}.json.zip";
var zipsUrlPath = "https://hearthstonejson.com/json/";
var zipsLocalFolder = 'jsonzips\\';

var folder = isSkipingDownload ? zipsLocalFolder : zipsUrlPath;
var zipFiles = _.map(languages, l => folder + zipsPattern.replace(/\{0\}/, l));

var cardSets = [];

function writeToFile(filePath, content) {
  console.log("Writing: " + filePath);
  var stream = fs.createWriteStream(filePath);
  stream.once('open', function (fd) {
    stream.write(content);
    stream.end();
  });
}

function write2Jsons(content) {
  writeToFile("output/merged.min.json", JSON.stringify(content));
  writeToFile("output/merged.formatted.json", JSON.stringify(content, null, 2));
}

function reducerToMakeFlatArray(result, input, key) {
  var improvedInput = _.map(input, function (v) {
    v.deckSet = key;
    return v;
  });
  return result.concat(improvedInput);
}

function afterCardsLoaded() {
  for (var i = 0; i < cardSets.length; i++) {
    var flattened = _.reduce(cardSets[i], reducerToMakeFlatArray, []);
    cardSets[i] = _.mapKeys(flattened, (value) => value.id);
  }
  var mergedCardSets = _.merge(cardSets[0], cardSets[1], function (a, b) {
    if (!_.isObject(a)) {
      if (a != b) {
        var res = {};
        res[languages[0]] = a;
        res[languages[1]] = b;
        return res;
      }
    }
  });
  const ordered = {};
  Object.keys(mergedCardSets).sort().forEach(function (key) {
    ordered[key] = mergedCardSets[key];
  });
  write2Jsons(ordered);
  console.log("DONE!");
}

function Downloader(file_url) {
  this.data = [];
  this.dataLen = 0;
  if (file_url.indexOf('http') === 0) {
    this.attachHttp(request.get(file_url));
  } else {
    fs.readFile(file_url, this.readFile.bind(this));
  }
}
Downloader.prototype.attachHttp = function (res) {
  res
    .on('data', this.onData.bind(this))
    .on('end', this.onEnd.bind(this));
};
Downloader.prototype.readFile = function (err, data) {
  this.onData(data);
  this.onEnd();
};
Downloader.prototype.onData = function (chunk) {
  this.data.push(chunk);
  this.dataLen += chunk.length;
};
Downloader.prototype.onEnd = function () {
  var buf = new Buffer(this.dataLen);
  for (var i = 0, len = this.data.length, pos = 0; i < len; i++) {
    var part = this.data[i];
    part.copy(buf, pos);
    pos += part.length;
  }
  var zip = new AdmZip(buf);
  var zipEntries = zip.getEntries();
  if (zipEntries.length !== 1) {
    throw new Error('zipEntries was not 1 but ' + zipEntries.length);
  }
  var unzipped = zip.readAsText(zipEntries[0]);
  var parsedData = JSON.parse(unzipped);
  cardSets.push(parsedData);

  if (cardSets.length === zipFiles.length) {
    afterCardsLoaded();
  }
};

for (var i = 0; i < zipFiles.length; i++) {
  var file_url = zipFiles[i];
  console.log("Reading: " + file_url);
  new Downloader(file_url);
}
