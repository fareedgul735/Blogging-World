import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
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


const url = "https://abwfisafbjptoxfaxiud.supabase.co";
const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFid2Zpc2FmYmpwdG94ZmF4aXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NTUxODksImV4cCI6MjA2MDEzMTE4OX0.u-rQYaFtmQXgTJ0_3T85T1P28Wmb7F81jfTWl2O8xdA";
const sbClient = supabase.createClient(url, anonKey);

const updateBtn = document.querySelector("#updateBlogBtn");
const updateTitle = document.querySelector("#updateTitle");
const updateImageFile = document.querySelector("#update-image-file");
const previewImage = document.querySelector("#update-preview-image");
const avatarDiv = document.getElementById("create-avatar")
const avatarName = document.getElementById("create-avatar-name")
let uploadedImagePath = "";

const fetchCharacterByName = (name) => {
  if (!name || typeof name !== "string") return "NA";

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "index.html"
  }
  if (user.displayName) {
    const userAvatar = fetchCharacterByName(user.displayName)
    avatarDiv.innerText = userAvatar;
    avatarName.innerText = user.displayName
  }
})

const urlId = window.location.hash.slice(1);
console.log(urlId, "urlId")
const blogRef = doc(db, "blogs", urlId);
const blogSnap = await getDoc(blogRef);

if (!blogSnap.exists()) {
  await Swal.fire({
    icon: "error",
    title: "Blogs Not Found"
  })
}

const blogData = blogSnap.data();

updateTitle.value = blogData.Title;
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
  if (!file) return await Swal.fire({
    icon: "error",
    title: "File is not Selected"
  })

  const reader = new FileReader();
  reader.onload = function (event) {
    previewImage.src = event.target.result;
    previewImage.style.display = "block";
  };
  reader.readAsDataURL(file);

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `public/${fileName}`;

  try {
    const {
      error
    } = await sbClient.storage
      .from("users")
      .upload(filePath, file);

    if (error) {
      console.error("Image upload failed:", error.message);
      await Swal.fire({
        icon: "error",
        title: "Image Upload File"
      })
      return;
    }

    const {
      data: publicUrlData
    } = sbClient.storage
      .from("users")
      .getPublicUrl(filePath);

    uploadedImagePath = publicUrlData.publicUrl;
  } catch (err) {
    console.error("Upload error:", err);
    await Swal.fire({
      icon: "error",
      title: "Unexpected Error"
    })
  }
});

updateBtn.addEventListener("click", async () => {
  if (
    updateTitle.value.trim() === "" ||
    !uploadedImagePath
  ) {
    await Swal.fire({
      icon: "error",
      title: "fields are required"
    })
    return;
  }

  const payLoad = {
    Title: updateTitle.value,
    Image: uploadedImagePath,
    uid: user.uid,
    name: user.displayName,
    publishedAt: blogData.publishedAt,
  };

  try {
    await updateDoc(blogRef, payLoad);
    await Swal.fire({
      icon: "success",
      title: "Blog Created Successfully"
    })
    window.location.href = "profile.html";
  } catch (err) {
    console.log(err);
    await Swal.fire({
      icon: "error",
      title: "Upload Failed"
    })
  }
});