document.addEventListener("DOMContentLoaded", () => {
  if (!AuthService.isAuthenticated()) {
    window.location.href = "login.html";
    return;
  }

  let currentStatusFilter = "";
  let currentPage = 1;
  let tasksPerPage = 5;

  const taskForm = document.getElementById("taskForm");
  const taskTitleInput = document.getElementById("taskTitle");
  const taskDescInput = document.getElementById("taskDescription");
  const titleError = document.getElementById("titleError");
  const aiGenBtn = document.getElementById("aiGenBtn");

  const taskContainer = document.getElementById("taskContainer");
  const emptyState = document.getElementById("emptyState");

  const paginationInfo = document.getElementById("paginationInfo");
  const pageNumberInput = document.getElementById("pageNumberInput");
  const tasksPerPageSelect = document.getElementById("tasksPerPageSelect");

  const filterButtons = document.querySelectorAll(".filter-btn");
  const logoutBtn = document.getElementById("logoutBtn");

  async function loadWorkspaceFeed() {
    try {
      const responseData = await TaskService.listTasks({
        status: currentStatusFilter,
        page: currentPage,
        limit: tasksPerPage,
      });

      const tasks = responseData;

      renderTaskGrid(tasks);
      updatePaginationControls(tasks.length);
    } catch (error) {
      console.error("Workspace Engine Error:", error);
      taskContainer.innerHTML = `<p class="error-text" style="display:block; text-align:center;">Failed to load tasks. Please try again.</p>`;
    }
  }

  function renderTaskGrid(tasks) {
    taskContainer.innerHTML = "";

    if (tasks.length === 0) {
      emptyState.classList.remove("hidden");
      return;
    }
    emptyState.classList.add("hidden");

    tasks.forEach((task) => {
      const isDone = task.status === "done";
      const cardElement = document.createElement("div");
      cardElement.className = `task-card ${isDone ? "done" : ""}`;

      const taskTitle = task.title;
      const taskDesc = task.description || "";

      cardElement.innerHTML = `
        <div class="task-main">
          <div class="task-title-row">
            <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${
        isDone ? "checked" : ""
      } />
            <h3 class="task-title">${taskTitle}</h3>
          </div>
          ${taskDesc ? `<p class="task-desc">${taskDesc}</p>` : ""}
        </div>
        <div class="task-controls">
          <span class="status-badge ${task.status}">${task.status}</span>
          <div class="action-buttons">
            <button class="icon-btn edit" title="Edit Task">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"></path>
              </svg>
            </button>
            <button class="icon-btn delete" data-id="${
              task.id
            }" title="Delete Task">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      `;

      const checkbox = cardElement.querySelector(".task-checkbox");
      checkbox.addEventListener("change", () => handleStatusToggle(task));

      const deleteBtn = cardElement.querySelector(".icon-btn.delete");
      deleteBtn.addEventListener("click", () => handleDeleteTask(task.id));

      const editBtn = cardElement.querySelector(".icon-btn.edit");
      editBtn.addEventListener("click", () => {
        cardElement.innerHTML = `
          <div class="task-main" style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
            <input type="text" class="form-input edit-title-input" value="${taskTitle}" style="padding: 6px 10px;" />
            <textarea class="form-input form-textarea edit-desc-input" rows="2" style="padding: 6px 10px;">${taskDesc}</textarea>
          </div>
          <div class="task-controls" style="justify-content: center; height: 100%;">
            <div class="action-buttons" style="flex-direction: column; gap: 6px;">
              <button class="icon-btn save-inline" title="Save Changes" style="padding: 4px 8px; font-size: 0.75rem; font-weight: bold; background-color: #f0fdf4; color: #16a34a; border-color: #bbf7d0;">Save</button>
              <button class="icon-btn cancel-inline" title="Cancel Editing" style="padding: 4px 8px; font-size: 0.75rem; font-weight: bold; background-color: #f1f5f9; color: #64748b;">Cancel</button>
            </div>
          </div>
        `;

        const titleInput = cardElement.querySelector(".edit-title-input");
        const descInput = cardElement.querySelector(".edit-desc-input");
        titleInput.focus();

        cardElement
          .querySelector(".save-inline")
          .addEventListener("click", async () => {
            const updatedTitle = titleInput.value.trim();
            if (!updatedTitle) {
              alert("Task title cannot be empty.");
              return;
            }
            try {
              await TaskService.updateTask(task.id, {
                title: updatedTitle,
                description: descInput.value.trim(),
                status: task.status,
              });
              loadWorkspaceFeed();
            } catch (error) {
              alert("Failed to update task: " + error.message);
            }
          });

        cardElement
          .querySelector(".cancel-inline")
          .addEventListener("click", () => {
            loadWorkspaceFeed();
          });
      });

      taskContainer.appendChild(cardElement);
    });
  }

  async function handleStatusToggle(task) {
    const nextStatus = task.status === "pending" ? "done" : "pending";
    try {
      await TaskService.updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: nextStatus,
      });
      loadWorkspaceFeed();
    } catch (error) {
      alert("Status mutation failed: " + error.message);
      loadWorkspaceFeed();
    }
  }

  async function handleDeleteTask(taskId) {
    if (!confirm("Are you sure you want to permanently delete this task?"))
      return;
    try {
      await TaskService.deleteTask(taskId);
      loadWorkspaceFeed();
    } catch (error) {
      alert("Failed to remove task: " + error.message);
    }
  }

  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titleValue = taskTitleInput.value.trim();
    const descValue = taskDescInput.value.trim();

    titleError.textContent = "";
    titleError.style.display = "none";

    if (!titleValue) {
      titleError.textContent = "Task title cannot be empty.";
      titleError.style.display = "block";
      return;
    }

    try {
      await TaskService.createTask({
        title: titleValue,
        description: descValue,
      });

      taskForm.reset();
      currentPage = 1;
      pageNumberInput.value = 1;
      loadWorkspaceFeed();
    } catch (error) {
      titleError.textContent = error.message;
      titleError.style.display = "block";
    }
  });

  aiGenBtn.addEventListener("click", async () => {
    const contextTitle = taskTitleInput.value.trim();
    if (!contextTitle) {
      titleError.textContent =
        "Enter a task title first to generate descriptions.";
      titleError.style.display = "block";
      return;
    }

    const originalHTML = aiGenBtn.innerHTML;
    try {
      aiGenBtn.disabled = true;
      aiGenBtn.innerHTML = `<span>Thinking...</span>`;

      const response = await TaskService.generateDescription(contextTitle);
      taskDescInput.value = response.description;
    } catch (error) {
      alert("AI Generation failed: " + error.message);
    } finally {
      aiGenBtn.disabled = false;
      aiGenBtn.innerHTML = originalHTML;
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      currentStatusFilter = e.target.getAttribute("data-status");
      currentPage = 1;
      pageNumberInput.value = 1;
      loadWorkspaceFeed();
    });
  });

  function updatePaginationControls(renderedCount) {
    paginationInfo.textContent = `Showing ${renderedCount} task(s) on Page ${currentPage}`;
  }

  pageNumberInput.addEventListener("change", (e) => {
    let targetPage = e.target.value;
    if (Number.isNaN(targetPage) || targetPage < 1) {
      targetPage = 1;
      pageNumberInput.value = 1;
    }
    currentPage = targetPage;
    loadWorkspaceFeed();
  });

  tasksPerPageSelect.addEventListener("change", (e) => {
    tasksPerPage = e.target.value;
    currentPage = 1;
    pageNumberInput.value = 1;
    loadWorkspaceFeed();
  });

  logoutBtn.addEventListener("click", () => {
    if (confirm("Log out of your active session?")) {
      AuthService.logout();
    }
  });

  loadWorkspaceFeed();
});
