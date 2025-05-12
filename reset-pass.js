import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Setup
const supabase = createClient("https://rlsukyvasyiyqhdniwdu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc3VreXZhc3lpeXFoZG5pd2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2OTc0MDksImV4cCI6MjA2MjI3MzQwOX0.PbhyoH8gGrFygXVB7jaji-_CH7GOwuTH8_iIxYOIs1g");

// Detect if user is in recovery mode (token present in URL)
const hashParams = new URLSearchParams(window.location.hash.substring(1));
const type = hashParams.get("type");
const access_token = hashParams.get("access_token");

// Show new password form if in recovery
if (type === "recovery" && access_token) {
  document.getElementById("newPasswordForm").classList.remove("hidden");

  document.getElementById("newPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value;

    // Set session using access token
    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token: hashParams.get("refresh_token")
    });

    if (sessionError) {
      return alert("Session error: " + sessionError.message);
    }

    // Now update password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      alert("Error updating password: " + updateError.message);
    } else {
      alert("Password updated successfully!");
      window.location.href = "home.html";
    }
  });
}
