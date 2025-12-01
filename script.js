// Word list taken from monkeytype source code: https://github.com/monkeytypegame/monkeytype/blob/master/frontend/static/languages/english.json
const language = await fetch("words.json").then((r) => r.json());
const words = language.words;

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getWords(length) {
  return Array.from({ length }, () => randomFrom(words));
}

function removeChildren(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

function floorTo(x, n) {
  const decimals = 10 ** n;
  return Math.floor(x * decimals) / decimals;
}

let activeTest = {
  started: false,
  length: 10,
  words: [],
  currentWord: 0,
  interval: null,
};

const statsContainer = document.querySelector(".stats > tbody");
const wordContainer = document.querySelector(".text-display");
const testContainer = document.querySelector(".test");
const input = document.querySelector("#text-input");
const configForm = document.querySelector("#config");

const liveWords = document.querySelector("#live-words");
const liveTime = document.querySelector("#live-time");

const newTestButton = document.querySelector("#new-test");

function newTest() {
  activeTest.started = false;
  activeTest.currentWord = 0;
  input.disabled = false;
  input.value = "";

  removeChildren(wordContainer);

  setTimeout(() => {
    removeChildren(statsContainer);
  }, 150);

  activeTest.words = getWords(activeTest.length).map((w) => {
    return { word: w, passed: false, correct: false };
  });

  renderWords();
  activeTest.words[0].element.id = "next";
  testContainer.classList.remove("completed");
  centerNext();

  startLiveUpdate();

  input.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

newTestButton.addEventListener("click", newTest);

function renderWords() {
  for (let i = 0; i < activeTest.words.length; i++) {
    const w = activeTest.words[i];
    const element = document.createElement("span");
    element.classList.add("word");
    element.textContent = w.word;
    wordContainer.appendChild(element);
    w.element = element;
  }
}

function compareWords(word, target) {
  const length = Math.max(word.length, target.length);

  return Array.from({ length }, (_, i) => word[i] === target[i]).reduce(
    ([c, i], correct) => [c + correct, i + !correct],
    [0, 0],
  );
}

function submitWord(typed) {
  const word = activeTest.words[activeTest.currentWord];

  word.typed = typed;
  word.correct = word.typed === word.word;
  word.passed = true;

  word.element.removeAttribute("id");

  [word.correctChars, word.incorrectChars] = compareWords(
    word.typed,
    word.word,
  );

  word.element.classList.add("passed");
  word.element.classList.add(word.correct ? "correct" : "incorrect");

  word.end = new Date();
  word.time = word.end - word.start; // In milliseconds

  activeTest.currentWord += 1;

  if (activeTest.currentWord >= activeTest.words.length) {
    endTest();
    return;
  }

  const nextWord = activeTest.words[activeTest.currentWord];
  nextWord.start = new Date();
  nextWord.element.id = "next";
  centerNext();
}

function formatTime(ms, withMs = false) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);

  const msFormat = withMs ? `.${String(milliseconds).padEnd(2, "0")}` : "";
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}${msFormat}`;
}

function endTest() {
  input.disabled = true;
  testContainer.classList.add("completed");

  // Time is counted per word to make it easier to expand in the future.
  // The difference is negligible compared to only comparing start and end times
  const time = activeTest.words.reduce((a, i) => a + i.time, 0);
  const minutes = time / 60000;

  const spaces = activeTest.words.filter((w) => w.correct).length;
  const targetChars = activeTest.words.reduce((a, i) => a + i.word.length, 0);
  const chars = activeTest.words.reduce((a, i) => a + i.typed.length, 0);
  const correctChars = activeTest.words.reduce((a, i) => a + i.correctChars, 0);
  const incorrectChars = activeTest.words.reduce(
    (a, i) => a + i.incorrectChars,
    0,
  );

  const totalChars = Math.max(targetChars, chars);

  const rawWpm = (chars + spaces) / 5 / minutes; // Measure wpm with one word defined as 5 characters on average.
  const wpm = (correctChars + spaces) / 5 / minutes;
  const accuracy = (correctChars / totalChars) * 100;

  const stats = [
    ["WPM", `${floorTo(wpm, 1)}`],
    ["Raw WPM", `${floorTo(rawWpm, 1)}`],
    ["Accuracy", `${floorTo(accuracy, 1)}%`],
    ["Time", formatTime(time, true)],
  ];

  for (const [k, v] of stats) {
    const row = document.createElement("tr");

    const key = document.createElement("td");
    key.textContent = k;
    key.classList.add("key");
    row.appendChild(key);

    const value = document.createElement("td");
    value.textContent = v;
    value.classList.add("value");
    row.appendChild(value);

    statsContainer.appendChild(row);
  }

  scrollTo(newTestButton, 12);

  clearInterval(activeTest.interval);
  updateLive();
}

function centerNext() {
  const next = activeTest.words[activeTest.currentWord].element;
  const containerRect = wordContainer.getBoundingClientRect();
  const nextRect = next.getBoundingClientRect();
  const lineCenter = nextRect.top + nextRect.height / 2 - containerRect.top;
  const offset = Math.floor(
    wordContainer.scrollTop + lineCenter - wordContainer.clientHeight / 2,
  );
  // Equivalent but the first also requires css scroll-behavior: smooth
  // wordContainer.scrollTop = offset;
  wordContainer.scrollTo({
    top: offset,
    behavior: "smooth",
  });
}

function updateLive() {
  liveWords.textContent = `${activeTest.currentWord}/${activeTest.length}`;

  const now = new Date();
  const timeDelta = now - (activeTest.words[0].start ?? now);
  liveTime.textContent = formatTime(timeDelta);
}

function startLiveUpdate() {
  updateLive();
  activeTest.interval = setInterval(updateLive, 100);
}

function scrollTo(element, offset = 0) {
  const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

input.addEventListener("input", (e) => {
  if (
    activeTest.currentWord >= activeTest.length - 1 &&
    input.value.trim() == activeTest.words.at(-1).word
  ) {
    submitWord(input.value.trim());
  } else if (e.data === " ") {
    if (input.value !== "") {
      submitWord(input.value.trim());
      input.value = "";
    }
    e.preventDefault();
  } else if (activeTest.currentWord === 0 && !activeTest.started) {
    // Starts the test
    activeTest.started = true;
    activeTest.words[0].start = new Date();
  }
});

input.addEventListener("paste", (e) => e.preventDefault());
input.addEventListener("drop", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => {
  if (e.code === "Tab") {
    newTest();
    e.preventDefault();
  }
});

window.addEventListener("resize", centerNext);

configForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  activeTest.length = parseInt(form.wordCount.value);
  newTest();
});

(() => {
  newTest();
})();
