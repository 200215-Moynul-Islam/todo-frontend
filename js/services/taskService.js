const TaskService = {
  BASE_URL: "http://192.168.0.237:8080/tasks",

  _getHeaders() {
    const token = localStorage.getItem("todo_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  },

  // Helper function to handle 401 intercepts and common errors cleanly
  _handleResponse(response, result, defaultMessage) {
    if (response.status === 401) {
      AuthService.logout(); // Automatically clears token and redirects to login.html
      return;
    }
    if (!response.ok || !result.success) {
      throw new Error(result.message || defaultMessage);
    }
    return result.data;
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
    return this._handleResponse(response, result, "Failed to fetch tasks");
  },

  async createTask(taskData) {
    const response = await fetch(this.BASE_URL, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(taskData),
    });

    const result = await response.json();
    return this._handleResponse(response, result, "Failed to create task");
  },

  async getTaskById(id) {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "GET",
      headers: this._getHeaders(),
    });

    const result = await response.json();
    return this._handleResponse(
      response,
      result,
      "Failed to fetch task details"
    );
  },

  async updateTask(id, updateData) {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "PUT",
      headers: this._getHeaders(),
      body: JSON.stringify(updateData),
    });

    const result = await response.json();
    return this._handleResponse(response, result, "Failed to update task");
  },

  async deleteTask(id) {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "DELETE",
      headers: this._getHeaders(),
    });

    const result = await response.json();
    return this._handleResponse(response, result, "Failed to delete task");
  },

  async generateDescription(title) {
    const response = await fetch(`${this.BASE_URL}/generate-description`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ title }),
    });

    const result = await response.json();
    return this._handleResponse(
      response,
      result,
      "Failed to generate description"
    );
  },
};
