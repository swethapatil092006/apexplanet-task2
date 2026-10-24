
// ========================================
// 1. Password Show / Hide
// ========================================

function togglePassword(inputId, button) {
    const passwordInput = document.getElementById(inputId);
    const icon = button.querySelector("i");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.className = "bi bi-eye-slash";
        button.setAttribute("aria-label", "Hide password");
    } else {
        passwordInput.type = "password";
        icon.className = "bi bi-eye";
        button.setAttribute("aria-label", "Show password");
    }
}


// ========================================
// 2. Get Sample Users Using Fetch API
// ========================================

async function getUsers() {
    const response = await fetch("users.json");

    if (!response.ok) {
        throw new Error("Could not load user data.");
    }

    const data = await response.json();
    return data.users;
}


// ========================================
// 3. Check Username / Email Availability
// ========================================

async function checkAvailability(field, value) {
    const users = await getUsers();
    const normalizedValue = value.trim().toLowerCase();

    return !users.some(user =>
        user[field].toLowerCase() === normalizedValue
    );
}


// ========================================
// 4. Display Availability Messages
// ========================================

async function checkField(inputId, messageId, field) {
    const input = document.getElementById(inputId);
    const message = document.getElementById(messageId);
    const value = input.value.trim();

    if (!value) {
        message.textContent = "";
        return true;
    }

    if (field === "email" && !input.validity.valid) {
        message.textContent = "Please enter a valid email address.";
        message.style.color = "red";
        return false;
    }

    if (field === "username" && value.length < 3) {
        message.textContent = "Username must be at least 3 characters.";
        message.style.color = "red";
        return false;
    }

    message.textContent = "Checking availability...";
    message.style.color = "#6a11cb";

    try {
        const available = await checkAvailability(field, value);

        // Ignore results if the input changed during the check.
        if (input.value.trim() !== value) {
            return false;
        }

        if (available) {
            message.textContent =
                "✓ " +
                (field === "username" ? "Username" : "Email") +
                " is available!";

            message.style.color = "green";
            return true;
        } else {
            message.textContent =
                "✗ This " +
                (field === "username" ? "username" : "email") +
                " is already registered.";

            message.style.color = "red";
            return false;
        }
    } catch (error) {
        message.textContent =
            "Unable to check. Please try again.";

        message.style.color = "red";
        return false;
    }
}


// ========================================
// 5. AJAX Username and Email Checks
// ========================================

document
    .getElementById("registerUsername")
    .addEventListener("blur", function () {
        checkField(
            "registerUsername",
            "usernameMessage",
            "username"
        );
    });

document
    .getElementById("registerEmail")
    .addEventListener("blur", function () {
        checkField(
            "registerEmail",
            "emailMessage",
            "email"
        );
    });


// ========================================
// 6. Login Form Validation
// ========================================

document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const emailInput =
            document.getElementById("loginEmail");

        const message =
            document.getElementById("loginMessage");

        if (!email || !password) {
            message.textContent = "Please fill in all fields.";
            message.style.color = "red";
            return;
        }

        if (!emailInput.validity.valid) {
            message.textContent =
                "Please enter a valid email address.";

            message.style.color = "red";
            return;
        }

        if (password.length < 6) {
            message.textContent =
                "Password must be at least 6 characters.";

            message.style.color = "red";
            return;
        }

        message.textContent =
            "Login successful! ✨ (Demo only)";

        message.style.color = "green";
    });


// ========================================
// 7. Registration Form Validation
// ========================================

document
    .getElementById("registerForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const username =
            document.getElementById("registerUsername").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const emailInput =
            document.getElementById("registerEmail");

        const message =
            document.getElementById("registerMessage");


        // Check empty fields
        if (
            !name ||
            !username ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            message.textContent = "Please fill in all fields.";
            message.style.color = "red";
            return;
        }


        // Check username length
        if (username.length < 3) {
            message.textContent =
                "Username must be at least 3 characters.";

            message.style.color = "red";
            return;
        }


        // Check email format
        if (!emailInput.validity.valid) {
            message.textContent =
                "Please enter a valid email address.";

            message.style.color = "red";
            return;
        }


        // Check password length
        if (password.length < 6) {
            message.textContent =
                "Password must be at least 6 characters.";

            message.style.color = "red";
            return;
        }


        // Check password matching
        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            message.style.color = "red";
            return;
        }


        // Check username and email using Fetch API
        message.textContent =
            "Checking username and email...";

        message.style.color = "#6a11cb";

        try {
            const users = await getUsers();

            const usernameExists = users.some(user =>
                user.username.toLowerCase() ===
                username.toLowerCase()
            );

            const emailExists = users.some(user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
            );


            if (usernameExists) {
                message.textContent =
                    "This username is already registered.";

                message.style.color = "red";
                return;
            }

            if (emailExists) {
                message.textContent =
                    "This email is already registered.";

                message.style.color = "red";
                return;
            }


            // Demo success message
            message.textContent =
                "Registration validation successful! 🎉 (Demo only)";

            message.style.color = "green";

            // This demo does not save accounts to users.json.
            // Real registration will require a backend and database.
            this.reset();

            document.getElementById("usernameMessage").textContent = "";
            document.getElementById("emailMessage").textContent = "";

        } catch (error) {
            message.textContent =
                "Unable to check availability. Please use Live Server and try again.";

            message.style.color = "red";
        }
    });
