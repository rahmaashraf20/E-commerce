function showError(id, message) {
  var el = document.getElementById(id);
  if (!el) return;
  if (message) {
    el.textContent = message;
    el.classList.add("show");
  } else {
    el.classList.remove("show");
  }
}

function clearErrors() {
  document.querySelectorAll(".error-msg").forEach(function(el) {
    el.classList.remove("show");
  });
  var success = document.getElementById("signupSuccess");
  if (success) success.classList.add("hidden");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  if (password.length < 8) return false;
  if (!/[a-zA-Z]/.test(password)) return false; 
  if (!/[0-9]/.test(password)) return false;       
  if (!/[^a-zA-Z0-9]/.test(password)) return false; 
  return true;
}

function getPasswordError(password) {
  if (password.length < 8)          return "Password must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(password))   return "Password must contain at least one letter.";
  if (!/[0-9]/.test(password))      return "Password must contain at least one number.";
  if (!/[^a-zA-Z0-9]/.test(password)) return "Password must contain at least one special character (e.g. @, #, !).";
  return null;
}

function saveUser(userData) {
  var users = getUsers();
  users.push(userData);
  localStorage.setItem("luxe_users", JSON.stringify(users));
}

function getUsers() {
  var stored = localStorage.getItem("luxe_users");
  return stored ? JSON.parse(stored) : [];
}

function findUser(email) {
  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === email.toLowerCase()) {
      return users[i];
    }
  }
  return null;
}

function saveSession(user, action) {
  localStorage.setItem("luxe_session", JSON.stringify({
    name: user.name,
    email: user.email,
    action: action,  
    time: new Date().toISOString()
  }));
}

function saveRememberMe(email) {
  localStorage.setItem("luxe_remember", email);
}

function loadRememberMe() {
  var remembered = localStorage.getItem("luxe_remember");
  var emailInput = document.getElementById("loginEmail");
  var rememberCheck = document.getElementById("rememberMe");
  if (remembered && emailInput) {
    emailInput.value = remembered;
    if (rememberCheck) rememberCheck.checked = true;
  }
}

function handleSignup() {
  clearErrors();

  var name     = document.getElementById("signupName").value.trim();
  var email    = document.getElementById("signupEmail").value.trim();
  var password = document.getElementById("signupPassword").value;
  var confirm  = document.getElementById("signupConfirm").value;

  var valid = true;

  if (name === "") {
    showError("signupNameError", "Full name is required.");
    valid = false;
  }

  if (!isValidEmail(email)) {
    showError("signupEmailError", "Please enter a valid email address.");
    valid = false;
  }

  var pwdError = getPasswordError(password);
  if (pwdError) {
    showError("signupPasswordError", pwdError);
    valid = false;
  }

  if (password !== confirm) {
    showError("signupConfirmError", "Passwords don't match.");
    valid = false;
  }

  if (!valid) return;

  if (findUser(email)) {
    showError("signupGeneralError", "This email is already registered. Please log in.");
    return;
  }

  saveUser({ name: name, email: email, password: password });
  saveSession({ name: name, email: email }, "signup");

  var successMsg = document.getElementById("signupSuccess");
  if (successMsg) successMsg.classList.remove("hidden");

  setTimeout(function() {
    window.location.href = "index.html";
  }, 1200);
}

function handleLogin() {
  clearErrors();

  var email    = document.getElementById("loginEmail").value.trim();
  var password = document.getElementById("loginPassword").value;
  var remember = document.getElementById("rememberMe").checked;

  var valid = true;

  if (!isValidEmail(email)) {
    showError("loginEmailError", "Please enter a valid email address.");
    valid = false;
  }

  if (password === "") {
    showError("loginPasswordError", "Please enter your password.");
    valid = false;
  }

  if (!valid) return;

  var user = findUser(email);

  if (!user) {
    showError("loginGeneralError", "No account found with this email. Please sign up.");
    return;
  }

  if (user.password !== password) {
    showError("loginGeneralError", "Incorrect password. Please try again.");
    return;
  }

  saveSession(user, "login");

  if (remember) {
    saveRememberMe(email);
  } else {
    localStorage.removeItem("luxe_remember");
  }

  window.location.href = "index.html";
}


function updateStrength(password) {
  var bar   = document.getElementById("strengthBar");
  var label = document.getElementById("strengthLabel");
  if (!bar || !label) return;

  var score = 0;
  if (password.length >= 8)              score++;
  if (/[a-zA-Z]/.test(password))        score++;
  if (/[0-9]/.test(password))           score++;
  if (/[^a-zA-Z0-9]/.test(password))   score++;

  var colors = ["#ef4444","#f97316","#eab308","#22c55e"];
  var labels = ["Weak","Fair","Good","Strong"];
  var widths = ["25%","50%","75%","100%"];

  if (password.length === 0) {
    bar.style.width = "0%";
    label.textContent = "";
    return;
  }

  var idx = score - 1;
  bar.style.width   = widths[idx];
  bar.style.background = colors[idx];
  label.textContent = labels[idx];
  label.style.color = colors[idx];
}

window.onload = function() {
  var params = new URLSearchParams(window.location.search);
  var emailFromSignup = params.get("email");
  var emailInput = document.getElementById("loginEmail");
  if (emailFromSignup && emailInput) {
    emailInput.value = emailFromSignup;
  }

  loadRememberMe();
  var pwdInput = document.getElementById("signupPassword");
  if (pwdInput) {
    pwdInput.addEventListener("input", function() {
      updateStrength(this.value);
    });
  }
};