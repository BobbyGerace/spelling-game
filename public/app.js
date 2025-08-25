import { SelectGame } from "./components/select-game/select-game.js";
import { Game } from "./components/game/game.js";
import { LetterButtons } from "./components/letter-buttons/letter-buttons.js";
import { InputField } from "./components/input-field/input-field.js";
import { TitleAnimation } from "./components/title-animation/title-animation.js";

document.addEventListener("DOMContentLoaded", () => {
  SelectGame.register();
  Game.register();
  InputField.register();
  LetterButtons.register();
  TitleAnimation.register();
});
