export class Model {
  input = "";

  constructor(letters) {
    this.letters = letters;
  }

  inputLetter(letter) {
    this.input += letter;
  }

  clearInput() {
    this.input = "";
  }
}
