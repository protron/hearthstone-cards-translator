# hearthstone-cards-translator
Translates Hearthstone card names from Spanish into English

## Usage
Compile the html file using:

    node merge-jsons.js && node format-html-from-merged.js

Then open `output\autocomplete.htm` in your web browser.

You will be presented with an autocomplete input ([awesomplete](https://leaverou.github.io/awesomplete/)) to search for the Latin America Spanish name of that card. Once selected, the page will show the English name of that selected card.
