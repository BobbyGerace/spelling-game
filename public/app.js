import { SelectGame } from "./components/select-game/select-game.js";
import { Game } from "./components/game/game.js";
import { LetterButtons } from "./components/letter-buttons/letter-buttons.js";
import { InputField } from "./components/input-field/input-field.js";
import { TitleAnimation } from "./components/title-animation/title-animation.js";
import { Notifier } from "./components/notifier/notifier.js";
import { FoundWords } from "./components/found-words/found-words.js";
import { ScoreBar } from "./components/score-bar/score-bar.js";

document.addEventListener("DOMContentLoaded", () => {
  FoundWords.register();
  ScoreBar.register();
  LetterButtons.register();
  InputField.register();
  Notifier.register();
  Game.register();
  TitleAnimation.register();
  SelectGame.register();
});
