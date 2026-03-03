const API_URL ="https://script.google.com/macros/s/AKfycbz9qovY0VLoENB3dSlBNSjuv5yuUwk6UegB9zLGv65kfg7TGzlusCAcVTFduENydDY/exec";

//Student Login Function
async function studentLogin() {
  const id = document.getElementById("studentId").value;
  const pass = document.getElementById("studentPass").value;

  if (id === "" || pass === "") {
    alert("Enter credentials");
    return;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "studentLogin",
      id: id,
      password: pass,
    }),
  });

  const data = await response.json();

  if (data.status === "success") {
  sessionStorage.setItem("student", id);
  window.location.href = "student.html";

} else if (data.status === "new") {
  sessionStorage.setItem("tempStudent", id);
  window.location.href = "setpassword.html";

} else {
  alert("Invalid credentials");
}
}

//Student Set Password Function
async function setPassword() {
  const newPass = document.getElementById("newPass").value;
  const id = sessionStorage.getItem("tempStudent");

  if (newPass === "") {
    alert("Enter Password");
    return;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "setPassword",
      id: id,
      password: newPass,
    }),
  });

  const data = await response.json();

  if (data.status === "success") {
    sessionStorage.removeItem("tempStudent");
    sessionStorage.setItem("student", id);
    window.location.href = "student.html";
  }
}

//Admin Login Function
async function adminLogin() {
  const id = document.getElementById("adminId").value;
  const pass = document.getElementById("adminPass").value;
  const loader = document.getElementById("overlayLoader");

  if (id === "" || pass === "") {
    alert("Enter credentials");
    return;
  }

  if (loader) loader.classList.remove("hidden");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "adminLogin",
        id: id,
        password: pass,
      }),
    });

    const text = await response.text();
    const data = JSON.parse(text);

    if (data.status === "success") {
      sessionStorage.setItem("admin", id);
      window.location.href = "admin.html";
    } else {
      alert("Invalid Admin Credentials");
    }

  } catch (error) {
    console.error("FULL ERROR:", error);
    alert("Server Error: " + error.message);
  }

  if (loader) loader.classList.add("hidden");
}

//Create student Function
async function createStudent() {

  const name = document.getElementById("newStudentName").value;
  const email = document.getElementById("newStudentEmail").value;
  const loader = document.getElementById("overlayLoader");

  if (name === "" || email === "") {
    alert("Enter all details");
    return;
  }

  if (loader) loader.classList.remove("hidden");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "createStudent",
        name: name,
        email: email,
      }),
    });

    const data = await response.json();
    console.log(data);
    if (data.status === "success") {

      alert("✅ Student Data Saved Successfully!\nStudent ID: " + data.studentId);

      document.getElementById("newStudentName").value = "";
      document.getElementById("newStudentEmail").value = "";

    } else {
      alert("❌ Failed to Save Student");
    }

  } catch (error) {
    alert("Server Error: " + error.message);
  }

  if (loader) loader.classList.add("hidden");
}

//Student Dashboard: Start Exam (placeholder)
function startExam() {
  alert("Exam module is not yet implemented.\nPlease contact the administrator.");
}

//Common logout for student pages
function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}
