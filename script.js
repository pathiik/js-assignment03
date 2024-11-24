const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task-button");
const taskList = document.getElementById("task-list");
const taskCounter = document.getElementById("task-counter");
const progressBar = document.getElementById("progress-bar");
const clearAllButton = document.getElementById("clear-all-button");
const themeToggle = document.getElementById("theme-toggle");

let totalTasks = 0;
let completedTasks = 0;

// Updating task stats
function updateTaskStats() {
  taskCounter.textContent = `Tasks: ${totalTasks} (Completed: ${completedTasks})`;
  progressBar.style.width = `${(completedTasks / totalTasks) * 100 || 0}%`;
}

// Saving tasks to local storage
function saveTasks() {
  const tasks = Array.from(taskList.children).map((task) => ({
    text: task.querySelector("span").textContent,
    completed: task.classList.contains("completed"),
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Loading tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    addTask(task.text, task.completed);
  });
}

// Adding task
function addTask(text, isCompleted = false) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item", ...(isCompleted ? ["completed"] : []));
  taskItem.draggable = true;
  taskItem.innerHTML = `
    <span>${text}</span>
    <div>
      <input type="checkbox" class="task-checkbox" ${
        isCompleted ? "checked" : ""
      }>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  taskList.appendChild(taskItem);
  totalTasks++;
  if (isCompleted) completedTasks++;
  updateTaskStats();
  saveTasks();
}

// Adding task event
addTaskButton.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (!taskText) return alert("Please enter a task!");
  addTask(taskText);
  taskInput.value = "";
});

// Handling task actions event
taskList.addEventListener("click", (e) => {
  const taskItem = e.target.closest(".task-item");

  // Making task as completed
  if (e.target.classList.contains("task-checkbox")) {
    taskItem.classList.toggle("completed", e.target.checked);
    completedTasks += e.target.checked ? 1 : -1;
    taskList.appendChild(taskItem);
    updateTaskStats();
    saveTasks();
  }

  // Deleting task
  if (e.target.classList.contains("delete-btn")) {
    taskItem.remove();
    totalTasks--;
    if (taskItem.querySelector(".task-checkbox").checked) completedTasks--;
    updateTaskStats();
    saveTasks();
  }
});

// Clearing all tasks event
clearAllButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    taskList.innerHTML = "";
    totalTasks = 0;
    completedTasks = 0;
    updateTaskStats();
    saveTasks();
  }
});

// Filtering task event
document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");
    document.querySelectorAll(".task-item").forEach((task) => {
      const isCompleted = task.classList.contains("completed");
      task.style.display =
        filter === "all" ||
        (filter === "completed" && isCompleted) ||
        (filter === "pending" && !isCompleted)
          ? "flex"
          : "none";
    });
  });
});

// Loading tasks on page load
window.addEventListener("load", loadTasks);
