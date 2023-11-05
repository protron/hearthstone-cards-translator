# hearthstone-cards-translator

Translates Hearthstone card names using cards data from [HearthstoneJSON](http://hearthstonejson.com/).

## Online usage

Go to [`http://protron.github.io/hearthstone-cards-translator/`](http://protron.github.io/hearthstone-cards-translator/)

## What is inside this GitHub repository?

1. a webpage ([output/index.html](https://github.com/protron/hearthstone-cards-translator/blob/master/output/index.html)) that allows its users to translate card names.
2. a Node.js program ([src/index.js](https://github.com/protron/hearthstone-cards-translator/blob/master/src/index.js)) that downloads the latest card names from HearthstoneJSON and generates the webpage in the step above.
3. a GitHub workflow ([.github\workflows\update-cards.yml](https://github.com/protron/hearthstone-cards-translator/blob/master/.github/workflows/update-cards.yml)) that checks every day for new card definitions from HearthstoneJSON, and if there are any, automatically updates all the code detailed in the steps above.

## How to use the webpage?

The webpage presents an autocomplete input ([awesomplete](https://leaverou.github.io/awesomplete/)) to search for the card name in the source language of your choice. Start typing and some options will appear below. Once you select one card, it will show in the right side the name of that card in the target language.

## Build

Having [node.js](https://nodejs.org/) v16 installed, open a command line in the folder in which you cloned the project, and run:

    npm build

That will automatically do the following:

1. Downloads cards information from HearthstoneJSON.
    1. If HearthstoneJSON has a newer version of the cards (comparing last time we downloaded using the date we store at `last-update.json`)
    2. Download the new version of the cards into `intermediate-assets/cards.json`.
    3. Generates `output/translations-*.js` for each source language (with just the texts from the card names).
2. Generates the output html: `output/index.html`.

Then, to host the generated website you can use:

    npm start

That will just host the output folder via `npx http-server output`.
