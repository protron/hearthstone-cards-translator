# hearthstone-cards-translator
Translates Hearthstone card names from Spanish into English using cards data from [HearthstoneJSON](http://hearthstonejson.com/).

## What is this?

This is a node program that generates a web page that lets you translate card names.

## How does the web page works?

The web page presents an autocomplete input ([awesomplete](https://leaverou.github.io/awesomplete/)) to search for the Latin American Spanish name of that card. Once selected, it will also show the English name of that selected card.

## Online usage:

Just go to the [online version at rawgit of hearthstone-cards-translator (2016-05-28)](https://cdn.rawgit.com/protron/hearthstone-cards-translator/f08db330bcad51581f4a052e38befdf4a32b4543/output/autocomplete.htm)

## Build (to update to latest HearthstoneJSON by yourself)

Having [node.js](https://nodejs.org/) installed, open a command line in the folder in which you cloned the project, and run:

    npm start

That command will perform 2 actions:

1. It downloads the latest `cards.json` from HearthstoneJSON into the `output` folder.
2. It generates the output html: `output/autocomplete.htm`

Then, just open `output/autocomplete.htm` in your web browser.

You are done! But if did a build (instead of just opening the online version), is probably because the online version is missing some update from HearthstoneJSON. So please consider help me keeping the online version updated by creating a [Pull Request](https://github.com/protron/hearthstone-cards-translator/pulls) (or an [Issue](https://github.com/protron/hearthstone-cards-translator/issues)).
