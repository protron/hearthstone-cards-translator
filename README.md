# hearthstone-cards-translator
Translates Hearthstone card names from Spanish into English (or other languages) using cards data from [HearthstoneJSON](http://hearthstonejson.com/).

## What is this?

This is a node program that generates a web page that lets you translate card names.

## How does the web page works?

The web page presents an autocomplete input ([awesomplete](https://leaverou.github.io/awesomplete/)) to search for the Latin American Spanish name of that card. Once selected, it will also show the name of that selected card in the target language.

## Online usage:

Just go to the [online version (cards updated on 2019-10-29)](http://protron.github.io/hearthstone-cards-translator/output/autocomplete.htm)

## Build (to update to latest HearthstoneJSON by yourself)

Having [node.js](https://nodejs.org/) installed, open a command line in the folder in which you cloned the project, and run:

    npm start

That command will perform 2 actions:

1. It downloads the latest `cards.json` from HearthstoneJSON into the `output` folder.
2. It generates the output html: `output/autocomplete.htm`

Then, just open [output/autocomplete.htm](output/autocomplete.htm) in your web browser.

You are done! But if build it yourself (instead of just opening the online version), it's probably because the online version is missing updates from HearthstoneJSON. In that case, consider creating a [Pull Request](https://github.com/protron/hearthstone-cards-translator/pulls) (or filing an [Issue](https://github.com/protron/hearthstone-cards-translator/issues)) in order keep the online version updated.
