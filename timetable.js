let tasks = [];
let editIndex = -1;
let notes = [];
let editNoteIndex = -1; // Index for editing notes

window.onload = function () {
  loadTasksFromCookies();
  loadNotesFromCookies(); // Ensure notes are loaded on window load
  const savedTheme = localStorage.getItem("theme") || "light"; // Default to light mode
  setTheme(savedTheme);
};

document
  .getElementById("add-task-btn")
  .addEventListener("click", addOrUpdateTask);

// Add event listener for notes
document.querySelector(".add-note-btn").addEventListener("click", addNote);

function addOrUpdateTask() {
  const timeInput = document.getElementById("task-time");
  const activityInput = document.getElementById("task-activity");

  const time = timeInput.value;
  const activity = activityInput.value;

  if (time && activity) {
    if (editIndex >= 0) {
      // Update existing task
      tasks[editIndex] = { time, activity };
      editIndex = -1; // Reset edit index
    } else {
      // Add new task
      tasks.push({ time, activity });
    }
    saveTasksToCookies();
    renderTasks();
    timeInput.value = "";
    activityInput.value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Clear existing tasks

  tasks.forEach((task, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${task.time}</td>
            <td>${task.activity}</td>
            <td>
                <button onclick="editTask(${index})">Edit</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </td>
        `;
    taskList.appendChild(row);
  });
}

function editTask(index) {
  const timeInput = document.getElementById("task-time");
  const activityInput = document.getElementById("task-activity");

  timeInput.value = tasks[index].time;
  activityInput.value = tasks[index].activity;
  editIndex = index; // Set edit index to the current task
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasksToCookies();
  renderTasks();
}

function saveTasksToCookies() {
  document.cookie =
    "tasks=" +
    encodeURIComponent(JSON.stringify(tasks)) +
    "; path=/; max-age=" +
    60 * 60 * 24; // Expires in 1 day
}

function loadTasksFromCookies() {
  const cookieArr = document.cookie.split("; ");
  for (let cookie of cookieArr) {
    if (cookie.startsWith("tasks=")) {
      const tasksData = cookie.split("=")[1];
      tasks = JSON.parse(decodeURIComponent(tasksData));
      renderTasks();
    }
  }
}

// Theme Management
function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const currentTheme = localStorage.getItem("theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
}

// Listen for storage changes
window.addEventListener("storage", (event) => {
  if (event.key === "theme") {
    setTheme(event.newValue);
  }
});

// Note management
function addNote() {
  const noteInput = document.querySelector(".note-input");
  const notesList = document.getElementById("notes-list");

  if (noteInput.value.trim() !== "") {
    if (editNoteIndex >= 0) {
      // Update existing note
      notes[editNoteIndex] = noteInput.value.trim();
      editNoteIndex = -1; // Reset edit index
    } else {
      // Add new note
      notes.push(noteInput.value.trim());
    }
    saveNotesToCookies(); // Save notes to cookies
    renderNotes(); // Render notes
    noteInput.value = ""; // Clear the input after adding
  }
}

function renderNotes() {
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = ""; // Clear existing notes

  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.textContent = note;

    // Make the list item clickable to edit the note
    li.onclick = () => editNote(index);

    // Create delete button for each note
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = (event) => {
      event.stopPropagation(); // Prevent triggering edit on delete click
      deleteNote(index); // Attach delete function
    };

    li.appendChild(deleteButton); // Append the delete button to the list item
    notesList.appendChild(li); // Append the list item to the notes list
  });
}

// Function to edit a note
function editNote(index) {
  const noteInput = document.querySelector(".note-input");
  noteInput.value = notes[index]; // Load note into the input for editing
  editNoteIndex = index; // Set the index of the note being edited
}

// Function to delete a note
function deleteNote(index) {
  notes.splice(index, 1); // Remove note from array
  saveNotesToCookies(); // Save updated notes to cookies
  renderNotes(); // Render updated notes
}

// Function to save notes to cookies
function saveNotesToCookies() {
  document.cookie =
    "notes=" +
    encodeURIComponent(JSON.stringify(notes)) +
    "; path=/; max-age=" +
    60 * 60 * 24; // Expires in 1 day
}

// Function to load notes from cookies
function loadNotesFromCookies() {
  const cookieArr = document.cookie.split("; ");
  for (let cookie of cookieArr) {
    if (cookie.startsWith("notes=")) {
      const notesData = cookie.split("=")[1];
      notes = JSON.parse(decodeURIComponent(notesData));
      renderNotes();
    }
  }
}
