const SUPABASE_URL = "https://rlsukyvasyiyqhdniwdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJsc3VreXZhc3lpeXFoZG5pd2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2OTc0MDksImV4cCI6MjA2MjI3MzQwOX0.PbhyoH8gGrFygXVB7jaji-_CH7GOwuTH8_iIxYOIs1g";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const signupForm = document.getElementById("signupForm");
const signupPasswordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    console.log("Email:", email); // Debugging: Check email value
    console.log("Password:", password); // Debugging: Check password value
    console.log("Confirm Password:", confirmPassword); // Debugging: Check confirm password value

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      const { data: user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log("User:", user); // Debugging: Check user data
      console.log("Error:", error); // Debugging: Check error

      if (error) throw error;

      alert("Signup successful! Redirecting to the home screen...");
      signupForm.reset();

      // Redirect to the home screen
      window.location.href = "home.html";
    } catch (error) {
      console.error("Signup error:", error); // Debugging: Log the error
      alert("Signup failed: " + error.message);
    }
  });
}