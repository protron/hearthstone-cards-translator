var request = require('request');
var fs = require('fs');
var AdmZip = require('adm-zip');
var http = require('http');
var _ = require('lodash');

var isSkipingDownload = process.argv[2] === '--skipdownload';

var zipFiles = !isSkipingDownload ? [
  'http://hearthstonejson.com/json/AllSets.enUS.json.zip',
  'http://hearthstonejson.com/json/AllSets.esMX.json.zip'
] : [
  'sources/AllSets.enUS.json.zip',
  'sources/AllSets.esMX.json.zip'
];
var langs = _.map(zipFiles, function(f) {
  return _.takeRight(f.split('.'), 3)[0];
});
var cardSets = [];

function writeToFile(filePath, content) {
  console.log("Writing: " + filePath);
  var stream = fs.createWriteStream(filePath);
  stream.once('open', function(fd) {
    stream.write(content);
    stream.end();
  });
}

function write2Jsons(content) {
  writeToFile("output/merged.min.json", JSON.stringify(content));
  writeToFile("output/merged.formatted.json", JSON.stringify(content, null, 2));
}

function afterCardsLoaded() {
  for (var i = 0; i < cardSets.length; i++) {
    var flattened = _.reduce(cardSets[i], function(result, n, key) {
      var improvedN = _.map(n, function(v) {
        v['deckSet'] = key;
        return v;
      });
      return result.concat(improvedN);
    }, []);
    cardSets[i] = _.mapKeys(flattened, function(value, key) {
      return value["id"];
    });
  }
  var mergedCardSets = _.merge(cardSets[0], cardSets[1], function(a, b) {
    if (!_.isObject(a)) {
      if (a != b) {
        var res = {};
        res[langs[0]] = a;
        res[langs[1]] = b;
        return res;
      }
    }
  });
  const ordered = {};
  Object.keys(mergedCardSets).sort().forEach(function(key) {
    ordered[key] = mergedCardSets[key];
  });
  write2Jsons(ordered);
  console.log("DONE!");
}

function Downloader(file_url) {
  this.data = [];
  this.dataLen = 0;
  if (file_url.indexOf('http') === 0) {
    http.get(file_url, this.attachHttp.bind(this));
  } else {
    fs.readFile(file_url, this.readFile.bind(this));
  }
}
Downloader.prototype.attachHttp = function(res) {
  res
    .on('data', this.onData.bind(this))
    .on('end', this.onEnd.bind(this));
};
Downloader.prototype.readFile = function(err, data) {
  this.onData(data);
  this.onEnd();
};
Downloader.prototype.onData = function(chunk) {
  this.data.push(chunk);
  this.dataLen += chunk.length;
};
Downloader.prototype.onEnd = function() {
  var buf = new Buffer(this.dataLen);
  for (var i = 0, len = this.data.length, pos = 0; i < len; i++) {
    var part = this.data[i];
    part.copy(buf, pos);
    pos += part.length;
  }
  var zip = new AdmZip(buf);
  var zipEntries = zip.getEntries();
  if (zipEntries.length != 1)
    throw new Error('zipEntries was not 1 but ' + zipEntries.length +
      ' try with a for loop');
  var unzipped = zip.readAsText(zipEntries[0]);
  var parsedData = JSON.parse(unzipped);
  cardSets.push(parsedData);

  if (cardSets.length == zipFiles.length) {
    afterCardsLoaded();
  }
};

for (var i = 0; i < zipFiles.length; i++) {
  var file_url = zipFiles[i];
  console.log("Reading: " + file_url);
  var d = new Downloader(file_url);
}