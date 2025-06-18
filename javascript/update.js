import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQSx-_hYSNv4Q3o2tzg3SCei7FB3Xj9kM",
  authDomain: "create-blogs-5959e.firebaseapp.com",
  projectId: "create-blogs-5959e",
  storageBucket: "create-blogs-5959e.firebaseapp.com",
  messagingSenderId: "538886768958",
  appId: "1:538886768958:web:40c68aa806db23239e446f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// this is supabase project Url //

const url = "https://abwfisafbjptoxfaxiud.supabase.co";
// this is supabase project api key //
const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFid2Zpc2FmYmpwdG94ZmF4aXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NTUxODksImV4cCI6MjA2MDEzMTE4OX0.u-rQYaFtmQXgTJ0_3T85T1P28Wmb7F81jfTWl2O8xdA";
const sbClient = supabase.createClient(url, anonKey);

let uploadedImagePath = "";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Sign in or sign up required !");
    location.href = "index.html";
    return;
  }

  const updateBtn = document.querySelector("#updateBlogBtn");
  const updateAuthor = document.querySelector("#updateAuthor");
  const updateTitle = document.querySelector("#updateTitle");
  const updateDes = document.querySelector("#updateDescription");
  const updateImageFile = document.querySelector("#update-image-file");
  const previewImage = document.querySelector("#update-preview-image");

  const urlId = window.location.hash.slice(1);
  console.log(urlId);
  const blogRef = doc(db, "blogs", urlId);
  const blogSnap = await getDoc(blogRef);

  if (!blogSnap.exists()) {
    alert("Blog Not Found!");
    return;
  }

  const blogData = blogSnap.data();

  updateAuthor.value = blogData.Author;
  updateTitle.value = blogData.Title;
  updateDes.value = blogData.Description;
  uploadedImagePath = blogData.Image;

  if (previewImage) {
    previewImage.src = uploadedImagePath;
    previewImage.style.display = "block";

    previewImage.style.cursor = "pointer";
    previewImage.addEventListener("click", () => {
      updateImageFile.click();
    });
  }

  updateImageFile.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return alert("No file selected");

    const reader = new FileReader();
    reader.onload = function (event) {
      previewImage.src = event.target.result;
      previewImage.style.display = "block";
    };
    reader.readAsDataURL(file);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `public/${fileName}`;

    try {
      const { error } = await sbClient.storage
        .from("users")
        .upload(filePath, file);

      if (error) {
        console.error("Image upload failed:", error.message);
        alert("Image upload failed");
        return;
      }

      const { data: publicUrlData } = sbClient.storage
        .from("users")
        .getPublicUrl(filePath);

      uploadedImagePath = publicUrlData.publicUrl;
    } catch (err) {
      console.error("Upload error:", err);
      alert("Unexpected error during upload");
    }
  });

  updateBtn.addEventListener("click", async () => {
    if (
      updateAuthor.value.trim() === "" ||
      updateTitle.value.trim() === "" ||
      updateDes.value.trim() === "" ||
      !uploadedImagePath
    ) {
      alert("All fields including image are required!");
      return;
    }

    const payLoad = {
      Author: updateAuthor.value,
      Title: updateTitle.value,
      Description: updateDes.value,
      Image: uploadedImagePath,
      uid: user.uid,
      name: user.displayName,
      publishedAt: blogData.publishedAt,
    };

    try {
      await updateDoc(blogRef, payLoad);
      alert("Blog Updated Successfully!");
      window.location.href = "read.html";
    } catch (err) {
      console.log(err);
      alert("Update Failed!");
    }
  });
});
