# hearthstone-cards-translator
Translates Hearthstone card names from Spanish into English using cards data from [Hearthstone JSON](http://hearthstonejson.com/).

## Build

Having [node.js](https://nodejs.org/) intalled, open a command line, go to the folder in which you cloned the project, and run:

    node merge-jsons.js && node format-html-from-merged.js

This generates the output html: [autocomplete.htm](./output/autocomplete.htm)<br>
<sup><sub>*Note: This process will also generates some intermediate json files, in the output folder, which can be used to get extra data on both languages (in a single json document).*</sub></sup>

## Usage

Open `output/autocomplete.htm` in your web browser, or go to the [last cached version at rawgit](https://cdn.rawgit.com/protron/hearthstone-cards-translator/a21d95c2b5276cb66413bf348ba65d76224d1bbc/output/autocomplete.htm)

You will be presented with an autocomplete input ([awesomplete](https://leaverou.github.io/awesomplete/)) to search for the Latin America Spanish name of that card. Once selected, the page will show the English name of that selected card.
