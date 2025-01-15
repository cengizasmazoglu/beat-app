import { db, collection, addDoc } from "./firebase.js";

const form = document.getElementById("registrationForm");
const messageDiv = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const team = document.getElementById("team").value;

  try {
    await addDoc(collection(db, "registrations"), { name, team });
    messageDiv.textContent = "Registration successful!";
    form.reset();
  } catch (error) {
    messageDiv.textContent = "Error: " + error.message;
  }
});

