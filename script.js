let tasks = [
  {
    id: 1,
    task: "Complete JavaScript Assignment",
    description: "Finish the Task Manager practical assignment.",
    date: "2026-10-25",
    priority: "high",
  },
  {
    id: 2,
    task: "Read JavaScript Notes",
    description: "Review functions, arrays, and objects.",
    date: "2026-10-27",
    priority: "medium",
  },
  {
    id: 3,
    task: "Buy Groceries",
    description: "Purchase vegetables, fruits, and milk.",
    date: "2026-10-24",
    priority: "low",
  },
];

let localTask = JSON.parse(localStorage.getItem("tasks")) || tasks;

let updateId = null;

// Priority order (high first, then medium, then low)
let priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};

showTask();

// Show Task 
function showTask() {
  let taskList = document.getElementById("taskList");
  let search = document.getElementById("search").value.toLowerCase();
  let priorityFilter = document.getElementById("filterPriority").value;

  // Filter tasks
  let filteredTasks = localTask.filter(function (task) {
    let priority = task.priority || "low";

    let searchMatch =
      task.task.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search);

    let priorityMatch = priorityFilter === "all" || priority === priorityFilter;

    return searchMatch && priorityMatch;
  });

  // Sort by priority
  filteredTasks.sort(function (a, b) {
    return (
      (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3)
    );
  });

  taskList.innerHTML = "";

  filteredTasks.forEach(function (task, index) {
    let priority = task.priority || "low";

    taskList.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${task.task}</td>
        <td>${task.description}</td>
        <td>${task.date}</td>

        <td>
          <span class="badge ${
            priority === "high"
              ? "bg-danger"
              : priority === "medium"
                ? "bg-warning text-dark"
                : "bg-success"
          }">
            ${priority}
          </span>
        </td>

        <td>
          <button
            class="btn btn-warning"
            onclick="editTask(${task.id})">
            Edit
          </button>
        </td>

        <td>
          <button
            class="btn btn-danger"
            onclick="deleteTask(${task.id})">
            Remove
          </button>
        </td>
      </tr>
    `;
  });
}

// Add / Update Task
document.getElementById("taskForm").onsubmit = function (event) {
  event.preventDefault();

  let task = document.getElementById("task").value;
  let description = document.getElementById("description").value;
  let date = document.getElementById("date").value;
  let priority = document.getElementById("priority").value;

  if (updateId === null) {
    let newTask = {
      id: new Date().getTime(),
      task: task,
      description: description,
      date: date,
      priority: priority,
    };

    localTask.push(newTask);
  } else {
    let index = localTask.findIndex(function (item) {
      return item.id === updateId;
    });

    if (index !== -1) {
      localTask[index].task = task;
      localTask[index].description = description;
      localTask[index].date = date;
      localTask[index].priority = priority;
    }

    updateId = null;

    document.getElementById("taskButton").innerText = "Add task";
  }

  updateLocalStorage();
  showTask();

  document.getElementById("taskForm").reset();
};

// Local Storage
function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(localTask));
}

// Search while typing
document.getElementById("search").addEventListener("input", showTask);

// Filter by priority
document.getElementById("filterPriority").addEventListener("change", showTask);

// Delete Task
function deleteTask(id) {
  localTask = localTask.filter(function (item) {
    return item.id !== id;
  });

  updateLocalStorage();
  showTask();
}

// Edit Task
function editTask(id) {
  let task = localTask.find(function (item) {
    return item.id === id;
  });

  if (task) {
    document.getElementById("task").value = task.task;
    document.getElementById("description").value = task.description;
    document.getElementById("date").value = task.date;
    document.getElementById("priority").value = task.priority || "low";

    updateId = id;

    document.getElementById("taskButton").innerText = "Update task";
  }
}