const AuthService = {
  BASE_URL: "http://192.168.0.237:8080/auth",

  async register(name, email, password) {
    const response = await fetch(`${this.BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Registration failed");
    }
    return result.data;
  },

  async login(email, password) {
    const response = await fetch(`${this.BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Invalid credentials");
    }

    // Server returns token raw string inside data wrapping context
    const token = result.data.token;

    localStorage.setItem("todo_token", token);
  },

  logout() {
    localStorage.removeItem("todo_token");
    window.location.href = "login.html";
  },

  isAuthenticated() {
    return localStorage.getItem("todo_token") !== null;
  },
};
