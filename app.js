import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
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
  storageBucket: "create-blogs-5959e.firebasestorage.app",
  messagingSenderId: "538886768958",
  appId: "1:538886768958:web:40c68aa806db23239e446f",
  measurementId: "G-NKZL02W59C",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const blogRef = collection(db, "blogs");

const blog = document.querySelector("#blogging");
const spinner = document.querySelector("#spinner");

onAuthStateChanged(auth, (user) => {
  const authRequiredElements = document.querySelectorAll(".auth-required");
  const guestOnlyElements = document.querySelectorAll(".guest-only");

  if (user) {
    authRequiredElements.forEach((el) => (el.style.display = "inline-block"));
    guestOnlyElements.forEach((el) => (el.style.display = "none"));
  } else {
    authRequiredElements.forEach((el) => (el.style.display = "none"));
    guestOnlyElements.forEach((el) => (el.style.display = "inline-block"));
  }
});

const fetchCharacterByName = (name) => {
  if (!name) return "!";
  return name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
};

const getData = async () => {
  try {
    const blogData = await getDocs(blogRef);
    return blogData;
  } catch (error) {
    console.log("Error fetching blogs:", error);
    return;
  }
};

const createCard = (cardDetail, id) => {
  const { Image, Title, Description, Author, publishedAt, name } = cardDetail;
  const titleLimit = 10;
  const descriptionLimit = 34;
  return `
    <div class="cardDiv">
      <img class="cardImg" src="${Image}" width="100%" height="242px" />
        <div class="avatarWrapper">
      <div class="avatarDiv avatar">
        <a class="avatarName">${fetchCharacterByName(name)}</a>
      </div>
      <span class= "fullName">${name}</span> 
      </div>
      <h2 class="cardTitle">${Title.slice(0, titleLimit)} ...</h2>
      <p class="cardDescription">${Description.slice(
        0,
        descriptionLimit
      )} .....</p>
      <p class="cardMeta">${Author}
        <span class="cardPublishedAt">${new Date(
          publishedAt
        ).toLocaleString()}</span>
      </p>
      <a class="moreDetail" href="detail.html#${id}">Read More</a>
    </div>`;
};

const avatarWrappers = document.querySelectorAll(".avatarWrapper");

avatarWrappers.forEach((wrapper) => {
  const avatar = wrapper.querySelector(".avatar");
  const fullName = wrapper.querySelector(".fullName");

  avatar.addEventListener("mouseover", () => {
    fullName.style.display = "inline";
  });

  avatar.addEventListener("mouseout", () => {
    fullName.style.display = "none";
  });
});

const readData = async () => {
  spinner.style.display = "block";
  blog.style.display = "none";

  try {
    const data = await getData();
    if (data.empty) {
      blog.innerHTML = `<p class="noBlogFound">No blogs available.</p>`;
    } else {
      blog.innerHTML = data.docs.map((recData) =>
        createCard(recData.data(), recData.id)
      );
    }

    spinner.style.display = "none";
    blog.style.display = "flex";
  } catch (error) {
    console.log("Error reading data:", error);
  }
};

readData();

const signOutBtns = document.querySelectorAll(".signOutBtn");
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
