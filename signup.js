import { updateProfile } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// After creating account
updateProfile(auth.currentUser, {
  displayName: "John Doe" // Replace with input field value
}).then(() => {
  localStorage.setItem("userName", "John Doe");
  window.location.href = "home.html";
});
