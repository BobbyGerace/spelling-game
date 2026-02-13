# Spelling Game

A clone of a popular word game written using vanilla HTML / JS / CSS.

This is a personal learning project—I'm trying out JS modules and web components to experiment with a web app architecture that doesn't use any libraries or tooling.

You can try it out [here](https://bobbygerace.github.io/spelling-game/)

## Acknowledgements

- [Common English Lexicon](https://github.com/Fj00/CEL), the source of the word list
- [Plain Vanilla Web](https://plainvanillaweb.com/), inspiration for many of the patterns employed here
- And of course the original game

## Running

```
npx live-server public
```

## How to cheat

(For testing purposes only, obvs)

Open the developer tools and enter the following for the complete word list

```js
document.getElementsByTagName('sg-game')[0].model.words
```