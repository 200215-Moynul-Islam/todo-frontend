const TaskService = {
  BASE_URL: "http://192.168.0.237:8080/tasks",

  _getHeaders() {
    const token = localStorage.getItem("todo_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  },

  async listTasks(options = {}) {
    const url = new URL(this.BASE_URL);

    if (options.status) url.searchParams.append("status", options.status);
    if (options.page) url.searchParams.append("page", options.page);
    if (options.limit) url.searchParams.append("limit", options.limit);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this._getHeaders(),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch tasks");
    }
    return result.data;
  },

  async createTask(taskData) {
    const response = await fetch(this.BASE_URL, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(taskData),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create task");
    }
    return result.data;
  },

  async getTaskById(id) {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "GET",
      headers: this._getHeaders(),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch task details");
    }
    return result.data;
  },

  async updateTask(id, updateData) {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "PUT",
      headers: this._getHeaders(),
      body: JSON.stringify(updateData),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update task");
    }
    return result.data;
  },

  async deleteTask(id) {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "DELETE",
      headers: this._getHeaders(),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete task");
    }
    return result.data;
  },
  
  async generateDescription(title) {
    const response = await fetch(`${this.BASE_URL}/generate-description`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ title }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to generate description");
    }
    return result.data;
  },
};
