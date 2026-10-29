/* =========================================================
   MATIVA - Main JavaScript file
   This one file is shared by every page. Each section first
   checks whether its elements exist on the current page.
   ========================================================= */

/* ---------- 1. Mobile navigation menu ---------- */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open"); // show or hide the menu
    const isOpen = navLinks.classList.contains("open");
    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", isOpen);
  });
}

/* ---------- 2. Footer year (updates automatically) ---------- */
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* ---------- 3. Animate skill bars (About page) ---------- */
const bars = document.querySelectorAll(".bar-fill");
if (bars.length > 0) {
  // Wait a moment so the CSS transition is visible
  setTimeout(function () {
    bars.forEach(function (bar) {
      bar.style.width = bar.dataset.level + "%";
    });
  }, 300);
}

/* ---------- 4. Academic planner (Planner page) ---------- */
// The array that stores all tasks. Each task is an object.
let tasks = [];
let nextId = 1;

const taskInput = document.getElementById("taskInput");
const taskCategory = document.getElementById("taskCategory");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const taskError = document.getElementById("taskError");

// Add a new task to the array
function addTask() {
  const text = taskInput.value.trim();
  const category = taskCategory.value;

  if (text === "") {
    taskError.textContent = "Please type a task first.";
    return;
  }
  taskError.textContent = "";

  tasks.push({ id: nextId, text: text, category: category, completed: false });
  nextId++;
  taskInput.value = "";
  displayTasks();
}

// Show all tasks on the page using DOM manipulation
function displayTasks() {
  taskList.innerHTML = ""; // clear the old list

  if (tasks.length === 0) {
    taskList.innerHTML =
      '<li class="empty-message">🎉 No tasks yet! Add your first task above.</li>';
  } else {
    tasks.forEach(function (task) {
      const li = document.createElement("li");
      li.className = "task-item" + (task.completed ? " completed" : "");
      li.innerHTML =
        '<span class="category"></span>' +
        '<span class="task-text"></span>' +
        '<button class="small-btn complete-btn" data-id="' + task.id + '">' +
        (task.completed ? "Undo" : "Done") + "</button>" +
        '<button class="small-btn delete-btn" data-id="' + task.id + '">Delete</button>';
      // textContent is used so user input is never treated as HTML
      li.querySelector(".category").textContent = task.category;
      li.querySelector(".task-text").textContent = task.text;
      taskList.appendChild(li);
    });
  }
  updateStats();
}

// Toggle a task between completed and not completed
function completeTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
  });
  displayTasks();
}

// Remove a task from the array
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  displayTasks();
}

// Update the total and completed counters
function updateStats() {
  const doneCount = tasks.filter(function (task) {
    return task.completed;
  }).length;
  totalTasks.textContent = tasks.length;
  completedTasks.textContent = doneCount;
}

// Connect the planner to events (only on the planner page)
if (addTaskBtn) {
  addTaskBtn.addEventListener("click", addTask);

  // Pressing Enter in the input also adds the task
  taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

  // One listener on the list handles every Done/Delete button
  taskList.addEventListener("click", function (event) {
    const id = Number(event.target.dataset.id);
    if (event.target.classList.contains("complete-btn")) {
      completeTask(id);
    } else if (event.target.classList.contains("delete-btn")) {
      deleteTask(id);
    }
  });

  displayTasks(); // show the empty message at the start
}

/* ---------- 5. Study tip of the day ---------- */
const studyTips = [
  "Study in 25-minute blocks with 5-minute breaks (the Pomodoro technique).",
  "Teach what you learned to a friend - it shows what you really understand.",
  "Review your notes within 24 hours of each lecture.",
  "Put your phone in another room while you study.",
  "Practise past questions before every examination.",
  "Sleep well! Your brain stores memories while you rest.",
  "Break big assignments into small, daily tasks."
];
const tipText = document.getElementById("tipText");
const newTipBtn = document.getElementById("newTipBtn");

if (tipText) {
  // Pick a tip based on today's date so it changes every day
  const todayIndex = new Date().getDate() % studyTips.length;
  tipText.textContent = studyTips[todayIndex];

  newTipBtn.addEventListener("click", function () {
    const randomIndex = Math.floor(Math.random() * studyTips.length);
    tipText.textContent = studyTips[randomIndex];
  });
}

/* ---------- 6. Contact form validation ---------- */
const contactForm = document.getElementById("contactForm");

// Show or clear an error message beside a field
function setError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const group = input.parentElement;
  group.querySelector(".error").textContent = message;
  if (message) {
    group.classList.add("invalid");
  } else {
    group.classList.remove("invalid");
  }
}

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the form from going to a server

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();
    const successBox = document.getElementById("successMessage");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const digitsPattern = /^[0-9]+$/;
    let isValid = true;

    // Full name
    if (name === "") { setError("fullName", "Please enter your full name."); isValid = false; }
    else { setError("fullName", ""); }

    // Email
    if (email === "") { setError("email", "Please enter your email address."); isValid = false; }
    else if (!emailPattern.test(email)) { setError("email", "Please enter a valid email, e.g. name@mail.com."); isValid = false; }
    else { setError("email", ""); }

    // Phone
    if (phone === "") { setError("phone", "Please enter your phone number."); isValid = false; }
    else if (!digitsPattern.test(phone)) { setError("phone", "Phone number must contain digits only."); isValid = false; }
    else { setError("phone", ""); }

    // Message
    if (message === "") { setError("message", "Please write a message."); isValid = false; }
    else if (message.length < 10) { setError("message", "Message must be at least 10 characters."); isValid = false; }
    else { setError("message", ""); }

    // Success
    if (isValid) {
      successBox.textContent = "✅ Thank you, " + name + "! Your message has been received.";
      successBox.classList.add("show");
      contactForm.reset();
    } else {
      successBox.classList.remove("show");
    }
  });
}
