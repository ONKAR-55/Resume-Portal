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
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const closeModalBtn = document.getElementById("closeModal");
const profileInfoCard = document.querySelector(".profile-info");
const checkBox = document.getElementById("checkbox");
const addResumeBtn = document.getElementById("addResumeBtn");
const resumeCard = document.getElementById("resumeUploadCard");
const closeResumeCardBtn = document.getElementById("closeResumeCard");
const resumeUploadForm = document.getElementById("resumeUploadForm");
const resumeFileInput = document.getElementById("resumeFile");

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
    if (data.session) {
      displayUserProfile(data.session);
    }
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

// Check box for showing/hiding password
checkBox.addEventListener("change", () => {
  if (checkBox.checked) {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

function displayUserProfile(session) {
  if(!session) return;
  profileImg.src = session.user.user_metadata.avatar_url || "https://ui-avatars.com/api/?name=Users";
  profileName.textContent = session.user.user_metadata.full_name || "User";
  profileEmail.textContent = session.user.email;
  profileSection.classList.remove("hidden");
  loginBtn.style.display = "none";
} 

// Check the user is loged in or not
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (session) {
    displayUserProfile(session);
  }
});

// Profile Info Card
profileImg.addEventListener("click", () => {
  profileInfoCard.classList.toggle("hidden");
});

// Logout
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

// Toggle resume upload card
addResumeBtn.addEventListener("click", () => {
  resumeCard.classList.add("visible");
  document.body.style.overflow = "hidden";
  profileInfoCard.classList.add("hidden")
});

closeResumeCardBtn.addEventListener("click", () => {
  resumeCard.classList.remove("visible");
  document.body.style.overflow = "auto";
});

// File Handeling
resumeUploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const resumeFile = resumeFileInput.files[0];
  const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
  const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);

  if (!resumeFile) {
    alert("Please select a file to upload.");
    return;
  }

  if (selectedCategories.length === 0) {
    alert("Please select at least one category.");
    return;
  }

  // Get user data
  const sessionData = await supabase.auth.getSession();
  const user = sessionData.data.session.user;
  const timestamp = Date.now();
  const fileName = `${user.user_metadata.full_name}_${timestamp}_${resumeFile.name}`; // Correct filename
  const filePath = `public/${fileName}`;

  const { data, error } = await supabase.storage
    .from("resumes")
    .upload(filePath, resumeFile, {
      cacheControl: "3600",
      upsert: false,
    });

  //Error and massage handeling
  if (error) {
    console.error("Error uploading resume:", error);
    console.error("Supabase Storage Error:", error.message); // Log the error message
    console.error("Supabase Storage Error Details:", error); // Log the entire error object
    alert("Failed to upload resume. Please try again.");
  } else {
    console.log("Resume uploaded successfully:", data);
    alert("Resume uploaded successfully!");
    resumeCard.classList.remove("visible");
    document.body.style.overflow = "auto";
    window.location.reload();

    
// Add resume metadata
    try {
      const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/resumes/${filePath}`; // Correct file URL
      await supabase.from("resume_metadata").insert({
        user_id: user.id,
        user_email: user.email,
        file_name: fileName,
        file_url: fileUrl,
        categories: JSON.stringify(selectedCategories),
        uploaded_at: new Date().toISOString()
      });
      console.log("Resume metadata added successfully.");
    } catch (metadataError) {
      console.error("Error adding resume metadata:", metadataError);
      alert("Failed to add resume metadata. Please check the console.");
    }
  }
});

// resume preview

async function loadRecentResumes() {
  const { data, error } = await supabase
    .from("resume_metadata")
    .select("*")
    .order("uploaded_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error loading recent resumes:", error);
    return;
  }

  const resumeList = document.getElementById("resumeList");
  resumeList.innerHTML = "";

  data.forEach(resume => {
    const card = document.createElement("div");
    card.className = "resume-card";

    card.innerHTML = `
      <p><strong>User:</strong> ${resume.user_email}</p>
      <p><strong>Categories:</strong> ${resume.categories.split(", ")}</p>
      <p><strong>Uploaded:</strong> ${new Date(resume.uploaded_at).toLocaleString()}</p>
      <a href="${resume.file_url}" target="_blank">View Resume</a>
    `;

    resumeList.appendChild(card);
  });
}

// Call on page load
loadRecentResumes();
