# hearthstone-cards-translator
Translates Hearthstone card names from Spanish into English using cards data from [Hearthstone JSON](http://hearthstonejson.com/).

## Build

Having [node.js](https://nodejs.org/) intalled, open a command line, go to the folder in which you cloned the project, and run:

    node merge-jsons.js && node format-html-from-merged.js

This generates the output html: [autocomplete.htm](./output/autocomplete.htm)<br>
<sub>*Note: This process also generates some intermediate json files which can be used to get more data on the 2 languages at the same time).*</sub>

## Usage

Open `output/autocomplete.htm` in your web browser, or go to the [last cached version at rawgit](https://cdn.rawgit.com/protron/hearthstone-cards-translator/8857cafca93b6a3ad3f67e1bde60cce1abbb4e57/output/autocomplete.htm)

You will be presented with an autocomplete input ([awesomplete](https://leaverou.github.io/awesomplete/)) to search for the Latin America Spanish name of that card. Once selected, the page will show the English name of that selected card.
