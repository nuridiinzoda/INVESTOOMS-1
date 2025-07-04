import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const name = user.displayName || "User";

      // ✅ Save to localStorage
      localStorage.setItem("userName", name);

      // ✅ Redirect to homepage or dashboard
      window.location.href = "home.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});
