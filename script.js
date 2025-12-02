import PocketBase from "https://cdnjs.cloudflare.com/ajax/libs/pocketbase/0.26.2/pocketbase.es.mjs";

// TODO: set up the backend
// const pb_host = "http://127.0.0.1:8090";
const pb_host = "https://pb-typing.olai.dev";
const pb = new PocketBase(pb_host);

// Word list taken from monkeytype source code: https://github.com/monkeytypegame/monkeytype/blob/master/frontend/static/languages/english.json
const language = await fetch("words.json").then((r) => r.json());
const words = language.words;

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getWords(length) {
  return Array.from({ length }, () => randomFrom(words));
}

function floorTo(x, n) {
  const decimals = 10 ** n;
  return Math.floor(x * decimals) / decimals;
}

let activeTest = {
  started: false,
  length: 25,
  words: [],
  currentWord: 0,
  interval: null,
};

let results = {};
let finished = false;

const wordContainer = document.querySelector(".text-display");
const testContainer = document.querySelector(".test");
const input = document.querySelector("#text-input");

const liveWords = document.querySelector("#live-words");
const secondsResult = document.querySelector("#seconds");

const newTestButton = document.querySelector("#new-test");
const submitButton = document.querySelector("#submit");
const form = document.querySelector("#form");

// Essentially a way to tell clients to ignore the old values if it is ever desired
const sessionTokenKey = "session_token";
const submittedKey = "submitted";
let sessionToken;
let submitted;

function loadLocalStorage() {
  sessionToken = localStorage.getItem(sessionTokenKey);
  if (!sessionToken) {
    sessionToken = crypto.randomUUID();
    localStorage.setItem(sessionTokenKey, sessionToken);
  }
  submitted = JSON.parse(localStorage.getItem(submittedKey)) || false;
  if (submitted) {
    document.querySelector("#main").classList.add("submitted");
  }
}

function newTest() {
  activeTest.started = false;
  activeTest.currentWord = 0;
  input.disabled = false;
  submitButton.disabled = true;
  input.value = "";

  wordContainer.innerHTML = "";
  secondsResult.innerHTML = "";

  activeTest.words = getWords(activeTest.length).map((w) => {
    return { word: w, passed: false, correct: false };
  });

  renderWords();
  activeTest.words[0].element.id = "next";
  testContainer.classList.remove("completed");
  centerNext();

  startLiveUpdate();
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

function endTest() {
  input.disabled = true;
  submitButton.disabled = false;
  testContainer.classList.add("completed");
  finished = true;

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

  results = {
    wpm: floorTo(wpm, 1),
    raw_wpm: floorTo(rawWpm, 1),
    accuracy: floorTo(accuracy, 1),
    time_ms: time,
  };

  const seconds = Math.floor(time / 1000);
  secondsResult.textContent = `Tid: ${seconds} sekunder`;

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
}

function startLiveUpdate() {
  updateLive();
  activeTest.interval = setInterval(updateLive, 100);
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

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let data = Object.fromEntries(new FormData(e.target));

  for (let key of ["coding", "game", "instrument", "touch"]) {
    data[key] = data[key] === "true";
  }
  data.class = data.class.toLowerCase();
  data.estimate = 0;

  const payload = {
    session_token: sessionToken,
    user_agent: navigator.userAgent, // TODO: also include hints https://chatgpt.com/share/692df6e8-3fb0-800d-9e01-71ddff70383a,
    ...data,
    ...results,
  };

  try {
    await pb.collection("submissions").create(payload);
  } catch {
    window.alert("Det oppstod en feil. Prøv igjen");
    return;
  }

  submitted = true;
  localStorage.setItem(submittedKey, JSON.stringify(submitted));

  window.location.href = window.location.href;
});

(() => {
  loadLocalStorage();
  newTest();
})();
