// Supabase Configuration
const SUPABASE_URL = "https://rlsukyvasyiyqhdniwdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc3VreXZhc3lpeXFoZG5pd2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2OTc0MDksImV4cCI6MjA2MjI3MzQwOX0.PbhyoH8gGrFygXVB7jaji-_CH7GOwuTH8_iIxYOIs1g";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dom Elements
const toggleBtn = document.getElementById("toggleSidebar");
const loginBtn = document.getElementById("loginBtn");
const profileSection = document.getElementById("profileSection");
const profileImg = document.getElementById("profileImg");
const profileName = document.getElementById("profileName"); 
const profileEmail = document.getElementById("profileEmail"); 
const logoutBtn = document.getElementById("logoutBtn");
const sidebar = document.getElementById("sidebar");
const loginModal = document.getElementById("loginModal");
const loginForm = docuent.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const closeModalBtn = document.getElementById("closeModal");
const profileInfoCard = document.querySelector(".profile-info");
const checkBox = document.getElementById("checkbox");

// Toggle Sidebar
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  toggleBtn.classList.toggle("active");
});

// Login Modal
loginBtn.addEventListener("click", () => {
  loginModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
});

// Close Login Modal
closeModalBtn.addEventListener("click", () => {
  loginModal.classList.add("hidden");
  document.body.style.overflow = "auto";
});

// Login Form Submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("Login failed. Please check your credentials.");
  } else {
    alert("Login successful!");
  }
});

// Check box for showing/hiding password
checkBox.addEventListener("change", () => {
  if (checkBox.checked) {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

// Handle Google Login
googleLoginBtn.addEventListener("click", async () => {
  const {error} = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:  window.location.href,
    },
  });
  if (error) {
    console.error("Error during Google login:", error);
  }
});

// Display User Profile
async function displayUserProfile() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (user) {
    profileSection.classList.remove("hidden");
    loginBtn.style.display = "none";
    profileName.textContent = user.user_metadata.full_name || "User";
    profileEmail.textContent = user.email || "Email not available";
  } else {
    alert("No user found. Please log in again.");
    profileSection.classList.add("hidden");
    loginBtn.style.display = "block";
  }
}

// Profile Info Card
profileImg.addEventListener("click", () => {
  profileInfoCard.classList.toggle("hidden");
});

// Handle Logout
logoutBtn.addEventListener("click", async () => {
  const confirmLogout = confirm("Are you sure you want to logout?");
  
  if (confirmLogout) {
  const { error } = await supabase.auth.signOut();
    if (error) {
    console.error("Error during logout:", error);
    } else {
    alert("Logout successful!");
    profileSection.classList.add("hidden");
    loginBtn.style.display = "block";
    profileInfoCard.classList.add("hidden");
    }
} else {
    console.log("Logout cancelled.");
  }
});

// Initialize the app
async function init() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
  } else if (user) {
    displayUserProfile();
  }
}