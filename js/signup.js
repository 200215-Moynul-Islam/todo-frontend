// Password Visibility Toggle Logic
document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    `;
    } else {
      passwordInput.type = "password";
      eyeIcon.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    `;
    }
  });

// Registration Processing Logic
document
  .getElementById("signupForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name").value;
    const emailInput = document.getElementById("email").value;
    const passwordInput = document.getElementById("password").value;

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    // Clean form values
    const name = nameInput.trim();
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput;

    // Clear previous execution error messages
    nameError.textContent = "";
    nameError.style.display = "none";
    emailError.textContent = "";
    emailError.style.display = "none";
    passwordError.textContent = "";
    passwordError.style.display = "none";

    let isFormValid = true;

    // Validate name
    if (name === "") {
      nameError.textContent = "Name is required";
      nameError.style.display = "block";
      isFormValid = false;
    }

    // Validate email
    if (email === "") {
      emailError.textContent = "Email is required";
      emailError.style.display = "block";
      isFormValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        emailError.textContent = "Invalid email format";
        emailError.style.display = "block";
        isFormValid = false;
      }
    }

    // Validate password
    if (password === "") {
      passwordError.textContent = "Password is required";
      passwordError.style.display = "block";
      isFormValid = false;
    } else if (password.length <= 6) {
      passwordError.textContent = "Password must be greater than 6 characters";
      passwordError.style.display = "block";
      isFormValid = false;
    }

    if (!isFormValid) return;

    try {
      await AuthService.register(name, email, password);
      await AuthService.login(email, password); // Log in the user after successful registration
      window.location.href = "index.html";
    } catch (error) {
      passwordError.textContent = error.message;
      passwordError.style.display = "block";
    }
  });
