import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase client
const supabaseUrl = "https://rlsukyvasyiyqhdniwdu.supabase.co"; // Replace with your project URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc3VreXZhc3lpeXFoZG5pd2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2OTc0MDksImV4cCI6MjA2MjI3MzQwOX0.PbhyoH8gGrFygXVB7jaji-_CH7GOwuTH8_iIxYOIs1g"; // Replace with your anon/public key
const supabase =  createClient(supabaseUrl, supabaseKey);

// Get DOM elements
const resetForm = document.getElementById('resetPasswordForm');
const newPasswordForm = document.getElementById('newPasswordForm');
const resetModal = document.getElementById('resetPasswordModal');
const closeBtn = document.getElementById('closeResetModal');

// === 1. Handle Send Reset Link ===
resetForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('resetEmail').value;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://127.0.0.1:5500/Resume-Portal/reset-pass.html" // change this if deployed elsewhere
  });

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert('Reset email sent. Check your inbox.');
  }
});

// === 2. Detect Access Token in URL (after clicking email link) ===
window.addEventListener('DOMContentLoaded', async () => {
  const hash = window.location.hash;
  const accessToken = new URLSearchParams(hash.substring(1)).get('access_token');

  if (accessToken) {
    // Let Supabase verify and log the user in with the access token
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error.message);
      return;
    }

    // Hide the email form and show new password form
    resetForm.classList.add('hidden');
    newPasswordForm.classList.remove('hidden');
  }
});

// === 3. Handle New Password Submission ===
newPasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newPassword = document.getElementById('newPassword').value;

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    alert("Error updating password: " + error.message);
  } else {
    alert("Password updated successfully!");
    window.location.href = 'index.html'; // Redirect to home or login page
  }
});

// === 4. Close Button Handler ===
closeBtn.addEventListener('click', () => {
  resetModal.style.display = 'none';
});
