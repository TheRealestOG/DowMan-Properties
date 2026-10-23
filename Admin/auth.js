const form = document.getElementById("login-form");
const message = document.getElementById("login-message");
const submitBtn = form.querySelector("button[type='submit']");

function showMessage(text) {
  message.textContent = text;
  message.hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.hidden = true;
  submitBtn.disabled = true;

  const { error } = await db.auth.signInWithPassword({
    email: form.email.value.trim(),
    password: form.password.value,
  });

  submitBtn.disabled = false;

  if (error) {
    showMessage("Incorrect email or password.");
    return;
  }
  window.location.replace("admin.html");
});