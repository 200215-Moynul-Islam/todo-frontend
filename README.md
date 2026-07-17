# ToDo — Frontend

A vanilla HTML/CSS/JavaScript frontend for a task management application, backed by a REST API (JWT-authenticated). No frameworks or build tools — plain static files.

## Features

- User registration and login with JWT-based session handling
- Create, edit (inline), complete/reopen, and delete tasks
- Filter tasks by status (All / Pending / Done)
- Pagination with configurable page size
- AI-assisted task description generation
- Password visibility toggle and client-side form validation on auth screens

## Tech Stack

- HTML5, CSS3 (custom properties, Flexbox/Grid)
- Vanilla JavaScript (no frameworks, no bundler)
- Google Fonts: Playfair Display, Montserrat

## Project Structure

```
.
├── index.html              # Main workspace (task list, create/edit/filter/paginate)
├── login.html               # Login page
├── signup.html               # Signup page
├── css/
│   ├── base.css              # Resets, variables, typography
│   ├── login-signup.css      # Auth screen styles
│   └── workspace.css         # Workspace layout and task card styles
└── js/
    ├── app.js                 # Workspace UI logic and event wiring
    ├── login.js                # Login form handling
    ├── signup.js                # Signup form handling
    └── services/
        ├── authService.js       # Auth API calls, token storage
        └── taskService.js        # Task CRUD API calls
```

## Architecture

The frontend follows a lightweight service-layer pattern:

- **`AuthService`** — handles registration, login, logout, and authentication state via a JWT stored in `localStorage`.
- **`TaskService`** — wraps all task-related API calls (list, create, update, delete, AI description generation) and attaches the bearer token to each request. Centralizes 401 handling by logging the user out and redirecting to `login.html`.
- **`app.js`** — orchestrates the workspace page: rendering the task list, wiring form/filter/pagination events, and delegating all network activity to the services above.

Pages are plain HTML files with no client-side routing; navigation happens via full page loads (`login.html`, `signup.html`, `index.html`).

## Getting Started

This is a static site — no build step or dependencies required.

1. Clone the repository:
   ```bash
   git clone https://github.com/200215-Moynul-Islam/todo-frontend.git
   cd todo-frontend
   ```
2. Ensure the backend API is running and reachable at the URL configured in `authService.js` / `taskService.js`.
3. Open the project folder in VS Code and run it with the **Live Server** extension (right-click `login.html` → "Open with Live Server"), or use any static file server of your choice.
4. The app will open at `login.html` (or `signup.html` for a new account).

## Notes

- Authentication is token-based; the session persists via `localStorage` until logout or a 401 response.
- Unauthenticated visits to `index.html` redirect to `login.html`.
