// ----------------------
// Toggle Panels (Signup/Login)
// ----------------------
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => container.classList.add("right-panel-active"));
signInButton.addEventListener("click", () => container.classList.remove("right-panel-active"));

// ----------------------
// Signup
// ----------------------
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const role = document.getElementById("signup-role").value;

  if (!role) return alert("Please select a role");

  try {
    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Signup failed");
    alert(data.message);
    container.classList.remove("right-panel-active");
  } catch (err) {
    alert("Network error: " + err.message);
  }
});

// ----------------------
// Login
// ----------------------
document.getElementById("signin-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const role = document.getElementById("login-role").value;

  if (!role) return alert("Please select a role");

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Login failed");

    // Save user session
    localStorage.setItem("user", JSON.stringify(data));

    // Redirect based on role
    if (data.role === "admin" || data.role === "organizer") {
      // Redirect to organizer.html instead of organizer-dashboard.html
      window.location.href = "organizer.html";
    } else {
      window.location.href = "volunteer-events.html";
    }
  } catch (err) {
    alert("Network error: " + err.message);
  }
});

// ----------------------
// Volunteer Assignment Form (assign.html)
// ----------------------
const volunteerForm = document.getElementById("volunteer-form");
if (volunteerForm) {
  volunteerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get volunteer form data
    const name = document.getElementById("vol-name").value;
    const email = document.getElementById("vol-email").value;
    const phone = document.getElementById("vol-phone").value;
    const skills = document.getElementById("vol-skills").value;
    const availability = document.getElementById("vol-availability").value;

    // Get event name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const event_name = urlParams.get("event");

    if (!event_name) return alert("Event not specified");

    try {
      const res = await fetch("http://localhost:5000/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, skills, availability, event_name }),
      });
      const data = await res.json();
      if (!res.ok || data.error) return alert(data.error || "Failed to submit assignment");
      alert(data.message);
      volunteerForm.reset();
    } catch (err) {
      alert("Network error: " + err.message);
    }
  });
}

// ----------------------
// Session Check for Dashboards
// ----------------------
const currentPage = window.location.pathname.split("/").pop();
if (currentPage.includes("dashboard") || currentPage === "organizer.html") {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) window.location.href = "login.html";
}

// ----------------------
// Logout (if page has logout button)
// ----------------------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}
