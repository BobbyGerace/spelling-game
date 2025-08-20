import { SelectGame } from "./components/select-game/select-game.js";
import { Game } from "./components/game.js";
import { LetterButtons } from "./components/letter-buttons/letter-buttons.js";

document.addEventListener("DOMContentLoaded", () => {
  SelectGame.register();
  Game.register();
  LetterButtons.register();
});
