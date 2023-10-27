const axios = require('axios').default;
const fs = require('fs');
const stream = require('stream');
const util = require('util');
var pjson = require('../package.json');

const outputPath = 'intermediate-assets/cards.json';

class lastUpdateIO {
  static filePath = "last-update.json";
  static async read() {
    const fileContent = await fs.promises.readFile(lastUpdateIO.filePath);
    const objectRead = JSON.parse(fileContent);
    return objectRead.cardsLastModified;
  }
  static async write(cardsLastModified) {
    const objectToStore = { cardsLastModified: cardsLastModified };
    const jsonString = JSON.stringify(objectToStore, null, "\t");
    await fs.promises.writeFile(lastUpdateIO.filePath, jsonString);
  }
}

async function fetchIfModifiedSince(urlToDownload, storedLastModified) {
  try {
    return await axios.get(urlToDownload, {
      responseType: 'stream',
      headers: {
        'If-Modified-Since': storedLastModified
      }
    });
  } catch (error) {
    const HttpStatusCode_NotModified = 304;
    if (error.response.status == HttpStatusCode_NotModified) {
      return null;
    } else {
      throw error;
    }
  }
}

async function writeResponseStreamIntoFile(responseData, outputLocationPath) {
  const outputFileStreamWriter = fs.createWriteStream(outputLocationPath);
  responseData.pipe(outputFileStreamWriter);
  const streamFinished = util.promisify(stream.finished);
  await streamFinished(outputFileStreamWriter);
}

async function run() {
  const storedLastModified = await lastUpdateIO.read();

  const urlToDownload = pjson.config.url_hearthstonejson_allcards;
  console.log(`Fetch ${urlToDownload}\n  (download only if newer than ${storedLastModified})...`);

  const response = await fetchIfModifiedSince(urlToDownload, storedLastModified);
  if (response == null) {
    console.log('We already have the latest version of the cards.');
    return;
  }
  await writeResponseStreamIntoFile(response.data, outputPath);

  const newLastModified = response.headers['last-modified'];
  await lastUpdateIO.write(newLastModified);

  console.log(`Downloaded newer version of: ${outputPath}\n  (last modified: ${newLastModified})`);
  if (global.onDownloadFinished) {
    global.onDownloadFinished();
  }
}

run();
