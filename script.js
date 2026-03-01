const API_URL = "https://script.google.com/macros/s/AKfycbyCSTK-Tp8tVLj7_QTQXXFVHtNqlwQWB_TOLXHiWcyLtsfrJbIoF8Zsz4pPf9KlO9xzAg/exec";

async function studentLogin(){

  const id = document.getElementById("studentId").value;
  const pass = document.getElementById("studentPass").value;

  if(id === "" || pass === ""){
    alert("Enter credentials");
    return;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "studentLogin",
      id: id,
      password: pass
    })
  });

  const data = await response.json();

  if(data.status === "success"){
      sessionStorage.setItem("student", id);
      window.location.href = "student.html";
  } else {
      alert("Invalid credentials");
  }
}



async function adminLogin(){

  const id = document.getElementById("adminId").value;
  const pass = document.getElementById("adminPass").value;

  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "adminLogin",
      id: id,
      password: pass
    })
  });

  const data = await response.json();

  if(data.status === "success"){
      sessionStorage.setItem("admin", id);
      window.location.href = "admin.html";
  } else {
      alert("Invalid Admin Credentials");
  }
}