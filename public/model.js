export class Model {
  input = "";

  constructor(letters) {
    this.letters = letters;
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
