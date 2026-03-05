const API_URL = "https://script.google.com/macros/s/AKfycbz9qovY0VLoENB3dSlBNSjuv5yuUwk6UegB9zLGv65kfg7TGzlusCAcVTFduENydDY/exec";

let editingId = null;

/************LOADER ***********/ 
function showLoader() {
  const loader = document.getElementById("overlayLoader");
  if (loader) loader.classList.remove("hidden");
}

function hideLoader() {
  const loader = document.getElementById("overlayLoader");
  if (loader) loader.classList.add("hidden");
}

/* ================= UI FUNCTIONS ================= */

function showStudent() {
  hideAll();
  document.getElementById("studentLogin")?.classList.remove("hidden");
}

function showAdmin() {
  hideAll();
  document.getElementById("adminLogin")?.classList.remove("hidden");
}

function goToSetPassword() {
  window.location.href = "setpassword.html";
}

function goBack() {
  hideAll();
  document.getElementById("roleSelection")?.classList.remove("hidden");
}

function hideAll() {
  document.getElementById("roleSelection")?.classList.add("hidden");
  document.getElementById("studentLogin")?.classList.add("hidden");
  document.getElementById("adminLogin")?.classList.add("hidden");
}

function toggleQuestionForm(){
  const form = document.getElementById("questionForm");
  if(!form) return;

  if(form.style.display === "none"){
    form.style.display = "block";
    form.scrollIntoView({ behavior: "smooth" });
  } else {
    form.style.display = "none";
  }
}

function checkAdminAuth(){
  if (!sessionStorage.getItem("admin")) {
    alert("Unauthorized Access");
    window.location.href = "index.html";
  }
}

/* ================= COMMON API CALL ================= */

async function callAPI(payload) {

  showLoader();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("API ERROR:", error);
    alert("Server Error: " + error.message);
    return { status: "error" };
  } finally {
    hideLoader();
  }
}

/* ================= STUDENT LOGIN ================= */

async function studentLogin() {

  const id = document.getElementById("studentId")?.value.trim();
  const pass = document.getElementById("studentPass")?.value.trim();

  if (!id || !pass) {
    alert("Enter credentials");
    return;
  }

  const data = await callAPI({
    action: "studentLogin",
    id,
    password: pass
  });

  if (data.status === "success") {
    sessionStorage.setItem("student", id);
    window.location.href = "student.html";

  } else if (data.status === "new") {
    sessionStorage.setItem("tempStudent", id);
    window.location.href = "setpassword.html";

  } else {
    alert(data.message || "Invalid credentials");
  }
}

/* ================= ADMIN LOGIN ================= */

async function adminLogin() {

  const id = document.getElementById("adminId")?.value.trim();
  const pass = document.getElementById("adminPass")?.value.trim();

  if (!id || !pass) {
    alert("Enter credentials");
    return;
  }

  const data = await callAPI({
    action: "adminLogin",
    id,
    password: pass
  });

  if (data.status === "success") {
    sessionStorage.setItem("admin", id);
    window.location.href = "admin.html";
  } else {
    alert("Invalid Admin Credentials");
  }
}

/* ================= CREATE STUDENT ================= */

async function createStudent() {

  const name = document.getElementById("newStudentName")?.value.trim();
  const email = document.getElementById("newStudentEmail")?.value.trim();

  if (!name || !email) {
    alert("Enter all details");
    return;
  }

  const data = await callAPI({
    action: "createStudent",
    name,
    email
  });

  if (data.status === "success") {

    alert("✅ Student Created\nID: " + data.studentId);

    document.getElementById("newStudentName").value = "";
    document.getElementById("newStudentEmail").value = "";

  } else {
    alert(data.message || "Failed to create student");
  }
}

/* ================= SET PASSWORD (FROM LOGIN FLOW) ================= */

async function setPassword() {

  const newPass = document.getElementById("newPass")?.value.trim();
  const id = sessionStorage.getItem("tempStudent");

  if (!newPass) {
    alert("Enter Password");
    return;
  }

  const data = await callAPI({
    action: "setPassword",
    id,
    password: newPass
  });

  if (data.status === "success") {

    sessionStorage.removeItem("tempStudent");
    sessionStorage.setItem("student", id);
    window.location.href = "student.html";

  } else {
    alert(data.message || "Cannot set password");
  }
}

/* ================= SET PASSWORD DIRECT ================= */

async function setPasswordDirect() {

  const id = document.getElementById("studentIdInput")?.value.trim();
  const newPass = document.getElementById("newPass")?.value.trim();

  if (!id || !newPass) {
    alert("Enter all details");
    return;
  }

  const data = await callAPI({
    action: "setPassword",
    id,
    password: newPass
  });

  if (data.status === "success") {
    alert("Password Set Successfully!");
    window.location.href = "index.html";
  } else {
    alert(data.message || "Invalid Student ID");
  }
}

/* ================= UPLOAD QUESTION ================= */

async function uploadQuestion() {

  const question = document.getElementById("questionText")?.value.trim();
  const optionA = document.getElementById("optionA")?.value.trim();
  const optionB = document.getElementById("optionB")?.value.trim();
  const optionC = document.getElementById("optionC")?.value.trim();
  const optionD = document.getElementById("optionD")?.value.trim();
  const correct = document.getElementById("correctAnswer")?.value;

  if (!question || !optionA || !optionB || !optionC || !optionD || !correct) {
    alert("Fill all fields");
    return;
  }

  if (!["A","B","C","D"].includes(correct)) {
    alert("Correct answer must be A, B, C or D");
    return;
  }

  const data = await callAPI({
    action: "uploadQuestion",
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correct
  });

  if (data.status === "success") {

    alert("Question Uploaded Successfully!");

    document.getElementById("questionText").value = "";
    document.getElementById("optionA").value = "";
    document.getElementById("optionB").value = "";
    document.getElementById("optionC").value = "";
    document.getElementById("optionD").value = "";
    document.getElementById("correctAnswer").value = "";

  } else {
    alert(data.message || "Upload Failed");
  }
}

async function saveQuestion(){

  const question = document.getElementById("questionText").value.trim();
  const optionA = document.getElementById("optionA").value.trim();
  const optionB = document.getElementById("optionB").value.trim();
  const optionC = document.getElementById("optionC").value.trim();
  const optionD = document.getElementById("optionD").value.trim();
  const correct = document.getElementById("correctAnswer").value;

  if(editingId){

    await callAPI({
      action:"updateQuestion",
      id:editingId,
      question, optionA, optionB, optionC, optionD, correct
    });

    editingId = null;

  }else{

    await callAPI({
      action:"uploadQuestion",
      question, optionA, optionB, optionC, optionD, correct
    });
  }

  clearForm();
  loadQuestions();
}

function editQuestion(id, q, a, b, c, d, correct){

  editingId = id;

  document.getElementById("questionText").value = q;
  document.getElementById("optionA").value = a;
  document.getElementById("optionB").value = b;
  document.getElementById("optionC").value = c;
  document.getElementById("optionD").value = d;
  document.getElementById("correctAnswer").value = correct;

  window.scrollTo(0,0);
}

function clearForm(){
  document.getElementById("questionText").value = "";
  document.getElementById("optionA").value = "";
  document.getElementById("optionB").value = "";
  document.getElementById("optionC").value = "";
  document.getElementById("optionD").value = "";
  document.getElementById("correctAnswer").value = "";
}



/* ================= LOGOUT ================= */

function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}

/* ================= PLACEHOLDER ================= */

function startExam() {
  alert("Exam module not implemented yet.");
}

function toggleSidebar(){
  document.getElementById("sidebar").classList.toggle("active");
}

function showSection(sectionId){

  const sections = document.querySelectorAll(".content-box");

  sections.forEach(sec => sec.classList.add("hidden"));

  document.getElementById(sectionId).classList.remove("hidden");

  toggleSidebar(); // auto close sidebar
}

async function loadQuestions(){

  const res = await callAPI({ action: "getQuestions" });

  if(res.status !== "success") return;

  const list = document.getElementById("questionList");
  const count = document.getElementById("questionCount");
  const search = document.getElementById("searchInput").value.toLowerCase();

  list.innerHTML = "";

  const filtered = res.data.filter(q =>
    q.question.toLowerCase().includes(search)
  );

  count.innerText = filtered.length;

  filtered.forEach(q => {

    list.innerHTML += `
      <div class="question-card">
        <p><strong>${q.question}</strong></p>
        <p>A: ${q.optionA}</p>
        <p>B: ${q.optionB}</p>
        <p>C: ${q.optionC}</p>
        <p>D: ${q.optionD}</p>
        <p>Correct: ${q.correct}</p>
        <button onclick="editQuestion('${q.id}','${q.question}','${q.optionA}','${q.optionB}','${q.optionC}','${q.optionD}','${q.correct}')">Edit</button>
        <button onclick="deleteQuestion('${q.id}')">Delete</button>
      </div>
      <hr>
    `;
  });
}

async function deleteQuestion(id){

  if(!confirm("Delete this question?")) return;

  const res = await callAPI({
    action: "deleteQuestion",
    id
  });

  hideLoader();

  if(res.status === "success"){
    alert("Question Deleted");
    loadQuestions();
  } else {
    alert(res.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {

  if(document.getElementById("questionList")){
    loadQuestions();
  }

});