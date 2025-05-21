import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
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
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const blog = document.querySelector("#blogging");
const spinner = document.querySelector("#spinner");

const fetchCharacterByName = (name) => {
  if (!name) return "NA";
  return name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
};

const createCard = (cardDetail, id) => {
  const { Image, Title, Description, Author, publishedAt } = cardDetail;
  const titleLimit = 10;
  const descriptionLimit = 34;

  return `
    <div class="cardDiv">
      <img class="cardImg" src="${Image}" width="100%" height="242px" />
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
      <div class = "icons">
        <div class = "detailIcons">
      <a class="moreDetail" href="detail.html#${id}">Read More</a>
         </div>
         <div class = "updatedIcons">
      <i onclick="onUpdate('${id}')" class="updateBlog fa-solid fa-pen"></i>
      <i onclick="onDelete('${id}')" class="blogDelete fa-solid fa-trash"></i>
    </div>
      </div>
    </div>`;
};

window.onDelete = async (id) => {
  const confirmDelete = confirm("Are you sure you want to delete?");
  if (confirmDelete) {
    try {
      await deleteDoc(doc(db, "blogs", id));
      alert("Blog deleted successfully!");
      location.reload();
    } catch (error) {
      console.log("Error deleting blog:", error);
      alert("Error deleting blog.");
    }
  }
};

window.onUpdate = (id) => {
  window.location.href = `update.html#${id}`;
};

const avatars = document.querySelectorAll(".userAvatar");
const fullNames = document.querySelectorAll(".userFullName");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    spinner.style.display = "block";
    blog.style.display = "none";

    if (user.displayName) {
      const initials = fetchCharacterByName(user.displayName);
      const fullNameText = user.displayName.toUpperCase();

      avatars.forEach((avatar) => {
        avatar.innerText = initials;
        avatar.style.display = "flex";
      });

      fullNames.forEach((fullName) => {
        fullName.innerText = fullNameText;
      });
    } else {
      avatars.forEach((avatar) => (avatar.style.display = "none"));
      fullNames.forEach((fullName) => (fullName.style.display = "none"));
    }

    try {
      const q = query(collection(db, "blogs"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        blog.innerHTML = `<p class= "noBlogFound">No blogs found.</p>`;
      } else {
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const card = createCard(data, docSnap.id);
          blog.innerHTML += card;
        });
      }

      spinner.style.display = "none";
      blog.style.display = "flex";
    } catch (error) {
      console.log("Error getting blogs:", error);
      alert("Error getting user blogs.");
    }
  } else {
    location.href = "index.html";
  }
});

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

const redirectAvatar = document.querySelectorAll(".userAvatar");

redirectAvatar.forEach((avatar) => {
  avatar.addEventListener("click", () => {
    location.href = "profile.html";
  });
});
