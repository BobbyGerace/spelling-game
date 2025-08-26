let cachedWordList = null;
let cachedGameList = null;

export class GameData {
  constructor(letters, totalWords, totalPoints) {
    this.letters = letters;
    this.totalWords = totalWords;
    this.totalPoints = totalPoints;
    this.wordList = this.discoverWords();

    if (this.wordList.length !== totalWords) {
      console.warn(
        `Word list does not match expected length. Expected ${this.totalWords} but got ${this.wordList.length}`,
      );
    }
  }

  discoverWords() {
    const words = [];
    const set = new Set(this.letters.split(""));
    const centralLetter = this.letters[0];

    for (const word of cachedWordList) {
      const chars = word.split("");
      if (chars.includes(centralLetter) && chars.every((c) => set.has(c))) {
        words.push(word);
      }
    }

    return words;
  }

  static async preloadDataBank() {
    if (cachedGameList && cachedWordList) return;

    const wordsPromise = fetch("/dictionary.csv").then((res) => res.text());
    const gamesPromise = fetch("/game_stats.csv").then((res) => res.text());

    // Simulate long load time
    // await new Promise((resolve) => setTimeout(resolve, 10000));

    const [wordsStr, gamesStr] = await Promise.all([
      wordsPromise,
      gamesPromise,
    ]);

    cachedWordList = parseWords(wordsStr);
    cachedGameList = parseGames(gamesStr);
  }

  static finishedLoading() {
    return cachedGameList && cachedWordList;
  }

  static randomGame() {
    if (!cachedGameList || !cachedWordList) {
      throw new Error("Tried to create game before load finished");
    }

    const randIdx = Math.floor(Math.random() * cachedGameList.length);
    const [letters, centralLetter, totalWords, totalPoints] =
      cachedGameList[randIdx];

    // Rearrange letters so that central letter comes first
    const orderedLetters =
      centralLetter +
      letters
        .split("")
        .filter((c) => c !== centralLetter)
        .join("");

    return new GameData(orderedLetters, totalWords, totalPoints);
  }
}

const parseWords = (wordsStr) => {
  return wordsStr
    .split("\n")
    .map((w) => w.trim().toUpperCase())
    .filter((w) => w.length >= 4);
};

const parseGames = (gamesStr) => {
  return gamesStr
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => {
      const [letters, centralLetter, totalWordsStr, totalPointsStr] = line
        .trim()
        .split(",");

      return [
        letters.toUpperCase(),
        centralLetter.toUpperCase(),
        parseInt(totalWordsStr),
        parseInt(totalPointsStr),
      ];
    });
};
