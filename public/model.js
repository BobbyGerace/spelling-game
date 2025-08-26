const STORAGE_KEY = "SPELLING_GAME_SAVE";

export class Model {
  input = "";

  constructor(letters, words, foundWords = []) {
    this.letters = letters;
    this.words = words;
    this.foundWords = this.foundWords;

    this.writeToStorage();
  }

  inputLetter(letter) {
    if (this.letters.includes(letter)) {
      this.input += letter;
      return true;
    }
    return false;
  }

  backspace() {
    this.input = this.input.slice(0, -1);
  }

  submit() {
    const word = this.input;

    let result = null;
    if (word.length < 4) {
      result = {
        success: false,
        reason: "Too short",
      };
    } else if (!word.includes(this.letters[0])) {
      result = {
        success: false,
        reason: "Missing central letter",
      };
    } else if (this.words.includes(word)) {
      this.foundWords.push(word);

      result = {
        success: true,
        points: this.points(word),
        isPangram: this.isPangram(word),
      };
    } else {
      result = {
        success: false,
        reason: "Invalid word",
      };
    }

    this.input = "";
    this.writeToStorage();

    return result;
  }

  points(word) {
    if (word.length === 4) {
      return 1;
    }

    const pangramPoints = this.isPangram(word) ? 7 : 0;

    return word.length + pangramPoints;
  }

  isPangram(word) {
    return new Set(word.split("")).size === 7;
  }

  writeToStorage() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        letters: this.letters,
        words: this.words,
        foundWords: this.foundWords,
      }),
    );
  }

  abandonGame() {
    localStorage.removeItem(STORAGE_KEY);
  }

  static fromStorage() {
    const savedGame = localStorage.getItem(STORAGE_KEY);

    if (savedGame == null) {
      return null;
    }

    const { letters, totalWords, totalPoints, foundWords } =
      JSON.parse(savedGame);

    return new Model(letters, totalWords, totalPoints, foundWords);
  }
}
