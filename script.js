let flashcards = [];
let currentCard = 0;
let pomodoroCount = 0;
let pomodoroDuration = 25 * 60;
let timer;
let isRunning = false;

function saveFlashcardsToCookie() {
  const flashcardsJSON = JSON.stringify(flashcards);
  document.cookie = `flashcards=${encodeURIComponent(
    flashcardsJSON
  )}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function loadFlashcardsFromCookie() {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "flashcards") {
      try {
        flashcards = JSON.parse(decodeURIComponent(value));
        return;
      } catch (e) {
        console.error("Error parsing flashcards from cookie:", e);
      }
    }
  }
  flashcards = [
    {
      front: "What is the capital of France?",
      back: "Paris",
      remembered: false,
    },
    { front: "What is 2 + 2?", back: "4", remembered: false },
    {
      front: "Who wrote 'Romeo and Juliet'?",
      back: "William Shakespeare",
      remembered: false,
    },
  ];
}

function updateCard() {
  const notRememberedCards = flashcards.filter((card) => !card.remembered);
  if (notRememberedCards.length > 0) {
    document.getElementById("front-content").textContent =
      notRememberedCards[currentCard].front;
    document.getElementById("back-content").textContent =
      notRememberedCards[currentCard].back;
  } else {
    document.getElementById("front-content").textContent = "No cards available";
    document.getElementById("back-content").textContent = "Add some cards!";
  }
}

function flipCard() {
  document.querySelector(".flashcard").classList.toggle("flipped");
}

function studyCards() {
  const notRememberedCards = flashcards.filter((card) => !card.remembered);
  if (notRememberedCards.length > 0) {
    currentCard = (currentCard + 1) % notRememberedCards.length;
    updateCard();
    document.querySelector(".flashcard").classList.remove("flipped");
  } else {
    alert("All cards remembered. Reset to start over.");
  }
}

function addCard() {
  const frontContent = document.getElementById("front-input").value;
  const backContent = document.getElementById("back-input").value;
  if (frontContent && backContent) {
    flashcards.push({
      front: frontContent,
      back: backContent,
      remembered: false,
    });
    document.getElementById("front-input").value = "";
    document.getElementById("back-input").value = "";
    updateCardList();
    saveFlashcardsToCookie();
    updateCard();
    currentCard = 0;
  }
}

function deleteCard(index) {
  flashcards.splice(index, 1);
  currentCard = Math.min(currentCard, flashcards.length - 1);
  updateCardList();
  saveFlashcardsToCookie();
  updateCard();
}

function deleteAllCards() {
  if (confirm("Are you sure you want to delete all cards?")) {
    flashcards = [];
    currentCard = 0;
    updateCard();
    updateCardList();
    saveFlashcardsToCookie();
  }
}

function updateCardList() {
  const cardList = document.getElementById("card-list-items");
  cardList.innerHTML = "";
  flashcards.forEach((card, index) => {
    const li = document.createElement("li");
    const cardText = document.createElement("span");
    cardText.textContent = card.front;
    cardText.className = "card-text";
    cardText.onclick = () => {
      currentCard = index;
      updateCard();
      document.querySelector(".flashcard").classList.remove("flipped");
    };

    const status = document.createElement("span");
    status.textContent = card.remembered ? "✓" : "✗";
    status.style.color = card.remembered ? "green" : "red";
    status.style.marginLeft = "10px";

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteCard(index);
    };

    li.appendChild(cardText);
    li.appendChild(status);
    li.appendChild(deleteBtn);
    cardList.appendChild(li);
  });
}

function markRemembered() {
  if (flashcards.length > 0) {
    const notRememberedCards = flashcards.filter((card) => !card.remembered);
    if (notRememberedCards.length > 0) {
      notRememberedCards[currentCard].remembered = true;
      updateCardList();
      saveFlashcardsToCookie();
    }
  }
}

function markNotRemembered() {
  studyCards();
}

function resetCards() {
  flashcards.forEach((card) => (card.remembered = false));
  currentCard = 0;
  updateCardList();
  saveFlashcardsToCookie();
  updateCard();
}

function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  document.getElementById("timer-display").textContent = `${String(
    minutes
  ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function startPomodoro() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (pomodoroDuration > 0) {
        pomodoroDuration--;
        updateTimerDisplay(pomodoroDuration);
      } else {
        clearInterval(timer);
        isRunning = false;
        pomodoroCount++;

        alert("Time's up! Take a break.");

        pomodoroDuration = 25 * 60;
        updateTimerDisplay(pomodoroDuration);
      }
    }, 1000);
  }
}

function stopPomodoro() {
  clearInterval(timer);
  isRunning = false;
}

function resetPomodoro() {
  clearInterval(timer);
  isRunning = false;
  pomodoroDuration = 25 * 60;
  updateTimerDisplay(pomodoroDuration);
}

document.getElementById("set-duration-btn").addEventListener("click", () => {
  const customDuration = document.getElementById("custom-duration").value;
  if (customDuration && customDuration > 0) {
    pomodoroDuration = customDuration * 60;
    updateTimerDisplay(pomodoroDuration);
  } else {
    alert("Please enter a valid duration in minutes.");
  }
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

document.getElementById("start-btn").addEventListener("click", startPomodoro);
document.getElementById("stop-btn").addEventListener("click", stopPomodoro);
document.getElementById("reset-btn").addEventListener("click", resetPomodoro);

updateTimerDisplay(pomodoroDuration);

loadFlashcardsFromCookie();
updateCard();
updateCardList();

function toggleDarkMode() {
  const currentTheme = localStorage.getItem("theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
}

function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  localStorage.setItem("theme", theme);
}

window.onload = function () {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
  loadFlashcardsFromCookie();
  updateCard();
  updateCardList();
};

window.addEventListener("storage", (event) => {
  if (event.key === "theme") {
    setTheme(event.newValue);
  }
});
