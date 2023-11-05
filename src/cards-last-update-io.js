import { readFile, writeFile } from 'node:fs/promises';

export class CardsLastUpdateIO {
  static filePath = "last-update.json";
  static async read() {
    const fileContent = await readFile(CardsLastUpdateIO.filePath);
    const objectRead = JSON.parse(fileContent);
    return objectRead.cardsLastModified;
  }
  static async write(cardsLastModified) {
    const objectToStore = { cardsLastModified: cardsLastModified };
    const jsonString = JSON.stringify(objectToStore, null, "\t");
    await writeFile(CardsLastUpdateIO.filePath, jsonString);
  }
}
