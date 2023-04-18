# hearthstone-cards-translator

Translates Hearthstone card names from Spanish into English (or other languages) using cards data from [HearthstoneJSON](http://hearthstonejson.com/).

## Online usage

Go to [`http://protron.github.io/hearthstone-cards-translator/output/autocomplete.htm`](http://protron.github.io/hearthstone-cards-translator/output/autocomplete.htm)

## What is inside this GitHub repository?

1. a web page (HTML + Javascript) that allows its users to translate card names.
2. a node.js program that generates the web page in step 1.
3. a node.js program that downloads the latest names of the cards from HearthstoneJSON to be used in the steps above.
4. a GitHub workflow ([update-cards.yml](https://github.com/protron/hearthstone-cards-translator/blob/master/.github/workflows/update-cards.yml)) that every day checks for new card definitions from HearthstoneJSON, and if there are any, automatically updates all the code detailed in the steps above.

## How to use the web page?

The web page presents an autocomplete input ([awesomplete](https://leaverou.github.io/awesomplete/)) to search for the Latin American Spanish name of that card. Once selected, it will also show the name of that selected card in the target language.

## Build

Having [node.js](https://nodejs.org/) installed, open a command line in the folder in which you cloned the project, and run:

    npm start

or

    npm start -- --skipdownload

The first command will perform the following actions (second command will skip the first step):

1. It downloads the latest `cards.json` from HearthstoneJSON into the `output` folder.
2. It generates the `translations.js` with just the texts from the card names.
3. It generates the output html: `output/autocomplete.htm`.

Then you just need to open that `output/autocomplete.htm` in your web browser.
