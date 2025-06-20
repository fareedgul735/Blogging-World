import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQSx-_hYSNv4Q3o2tzg3SCei7FB3Xj9kM",
  authDomain: "create-blogs-5959e.firebaseapp.com",
  projectId: "create-blogs-5959e",
  storageBucket: "create-blogs-5959e.appspot.com",
  messagingSenderId: "538886768958",
  appId: "1:538886768958:web:40c68aa806db23239e446f",
  measurementId: "G-NKZL02W59C",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const blogRef = collection(db, "blogs");

// this is supabase project Url //
const url = "https://abwfisafbjptoxfaxiud.supabase.co";

// this is supabase project api key //
const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFid2Zpc2FmYmpwdG94ZmF4aXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NTUxODksImV4cCI6MjA2MDEzMTE4OX0.u-rQYaFtmQXgTJ0_3T85T1P28Wmb7F81jfTWl2O8xdA";
const sbClient = supabase.createClient(url, anonKey);

let uploadedImagePath = "";

onAuthStateChanged(auth, (user) => {
  if (!user) location.href = "index.html";
});

const imageInput = document.querySelector("#image-file");
const previewImage = document.getElementById("preview-image");
const plusIcon = document.getElementById("plus-icon");

imageInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return alert("No file selected");

  const reader = new FileReader();
  reader.onload = function (e) {
    previewImage.src = e.target.result;
    previewImage.style.display = "block";
    plusIcon.style.display = "none";
  };
  reader.readAsDataURL(file);

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `public/${fileName}`;
  console.log(filePath);

  try {
    const {
      error
    } = await sbClient.storage
      .from("users")
      .upload(filePath, file);

    if (error) {
      console.error("Image upload failed:", error.message);
      alert("Image upload failed");
      return;
    }

    const {
      data
    } = sbClient.storage.from("users").getPublicUrl(filePath);

    uploadedImagePath = data?.publicUrl;

    console.log("Uploaded image URL:", uploadedImagePath);
  } catch (err) {
    console.error("Upload error:", err);
    alert("Unexpected error during upload");
  }
});

const createBlog = document.querySelector("#createBlogBtn");

const createData = async () => {
  const user = auth.currentUser;

  let titleInput = document.querySelector("#title");
  let imageUrl = uploadedImagePath;

  let inputArray = [titleInput];
  inputArray.forEach((input) => (input.style.border = "1px solid blue"));

  let checkIsEmpty =
    inputArray.some((input) => input.value.trim() === "") || !uploadedImagePath;

  if (checkIsEmpty && !uploadedImagePath) {
    alert("All fields including image are required");
    inputArray.forEach((input) => {
      if (input.value.trim() === "") input.style.border = "1px solid red";
    });
    return;
  }

  const payLoad = {
    Title: titleInput.value,
    Image: imageUrl,
    publishedAt: new Date().toISOString(),
    uid: user.uid,
    name: user.displayName,
  };

  try {
    await addDoc(blogRef, payLoad);
    alert("Blog created successfully!");
    location.href = "read.html";
  } catch (error) {
    console.log(error);
    alert("Blog creation failed!");
  }
};

createBlog.addEventListener("click", createData);

const signOutBtns = document.querySelectorAll(".signOutBtns");
const modal = document.getElementById("signOutModal");
const confirmBtn = document.getElementById("confirmSignOut");
const cancelBtn = document.getElementById("cancelSignOut");

signOutBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.style.display = "flex";
  });
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

confirmBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    location.href = "index.html";
  } catch (error) {
    alert("Error Login out:", error.message);
  }
});

const sideBarBtnOpen = document.querySelector("#sideBarBtnOpen");
const sideBarBtnClose = document.querySelector("#sideBarBtnClose");
const sideBar = document.querySelector("#leftSideSideBar");

sideBarBtnOpen?.addEventListener("click", () => {
  sideBar.classList.add("active");
});

sideBarBtnClose?.addEventListener("click", () => {
  sideBar.classList.remove("active");
});