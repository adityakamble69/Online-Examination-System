const API_URL ="https://script.google.com/macros/s/AKfycby-h-rO-pODL9yR_h-wBVIDsVvpxSCxnrIpM0hnS8vIa-0X7fAQdPddOziW5sVX4-ycUg/exec";

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

  loader.classList.remove("hidden");

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

    const data = await response.json();

    if (data.status === "success") {
      sessionStorage.setItem("admin", id);
      window.location.href = "admin.html";
    } else {
      alert("Invalid Admin Credentials");
    }
  } catch (error) {
    alert("Server Error");
  }

  loader.classList.add("hidden");
}

async function createStudent() {
  const name = document.getElementById("newStudentName").value;
  const email = document.getElementById("newStudentEmail").value;

  if (name === "" || email === "") {
    alert("Enter all details");
    return;
  }

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

  if (data.status === "success") {
    alert("Student Created!\nID: " + data.studentId);
  }
}
