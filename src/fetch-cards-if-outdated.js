import { pathToFileURL } from 'node:url';
import { createWriteStream } from 'node:fs';
import { finished } from "node:stream/promises";
import axios from "axios";
import { url_hearthstonejson_allcards } from "./settings.js"
import { CardsLastUpdateIO } from './cards-last-update-io.js';

const outputPath = 'intermediate-assets/cards.json';

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
  const outputFileStreamWriter = createWriteStream(outputLocationPath);
  responseData.pipe(outputFileStreamWriter);
  await finished(outputFileStreamWriter);
}

export default async function fetchCardsIfOutdated() {
  const storedLastModified = await CardsLastUpdateIO.read();

  console.log(`Fetch ${url_hearthstonejson_allcards}\n  (download only if newer than ${storedLastModified})...`);
  const response = await fetchIfModifiedSince(url_hearthstonejson_allcards, storedLastModified);
  if (response == null) {
    console.log('We already have the latest version of the cards.');
    return false;
  }
  await writeResponseStreamIntoFile(response.data, outputPath);

  const newLastModified = response.headers['last-modified'];
  await CardsLastUpdateIO.write(newLastModified);

  console.log(`Downloaded newer version of: ${outputPath}\n  (last modified: ${newLastModified})`);
  return true;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await fetchCardsIfOutdated();
}
