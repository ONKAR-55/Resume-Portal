// Supabase Configuration
const SUPABASE_URL = "https://rlsukyvasyiyqhdniwdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc3VreXZhc3lpeXFoZG5pd2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2OTc0MDksImV4cCI6MjA2MjI3MzQwOX0.PbhyoH8gGrFygXVB7jaji-_CH7GOwuTH8_iIxYOIs1g";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dom Elements
const toggleBtn = document.getElementById("toggleSidebar");
const loginBtn = document.getElementById("loginBtn");
const profileSection = document.getElementById("profileSection");
const profileImg = document.getElementById("profileImg");
const logoutBtn = document.getElementById("logoutBtn");
const sidebar = document.getElementById("sidebar");
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const closeModalBtn = document.getElementById("closeModal");
const profileInfoCard = document.querySelector(".profile-info");

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
    loginModal.classList.add("hidden");
    document.body.style.overflow = "auto";
    profileSection.classList.remove("hidden");
    loginBtn.style.display = "none";
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

// Display Profile Section
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    console.log("User is logged in:", session.user);
    profileImg.src = session.user.user_metadata.avatar_url || "default-avatar.png";
    profileName.textContent = session.user.user_metadata.full_name || "User";
    profileEmail.textContent = session.user.email;
    profileSection.classList.remove("hidden");
    loginBtn.style.display = "none";
  }
});

// Profile Info Card
profileImg.addEventListener("click", () => {
  profileInfoCard.classList.toggle("hidden");
});

// Handle Logout
logoutBtn.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error during logout:", error);
  }  
});
