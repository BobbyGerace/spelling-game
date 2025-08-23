export class Model {
  input = "";

  constructor(gameData) {
    this.gameData = gameData;
    this.letters = gameData.letters;
  }

  inputLetter(letter) {
    if (this.letters.includes(letter)) {
      this.input += letter;
      return true;
    }
    return false;
  }

  clearInput() {
    this.input = "";
  }
}
