import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
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
const launchScreen = document.getElementById("launch-screen");

const navAvatar = document.getElementById("nav-avatar")
const footerAvatar = document.getElementById("footer-avatar")
const leftSideAvatar = document.getElementById("left-side-avatar")
const leftSideAvatarName = document.getElementById("left-side-avatar-name")



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
    location.href = "index.html";
    return;
  }

  if (user.displayName) {
    try {
      const userName = fetchCharacterByName(user.displayName);

      if (navAvatar) navAvatar.innerText = userName;
      if (footerAvatar) footerAvatar.innerText = userName;
      if (leftSideAvatar) leftSideAvatar.innerText = userName;
      if (leftSideAvatarName) leftSideAvatarName.innerText = user.displayName;

    } catch (error) {
      console.error("Failed to fetch character name:", error);
    }
  }
});



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
  const {
    Image,
    Title,
    publishedAt,
    name
  } = cardDetail;
  return `
  <div class="blogCardDiv">
    <div class="avatarWrapper">
      <div class="avatarDiv">
     <div class="avatar-container">
    <a class="avatar">${fetchCharacterByName(name)}</a>
     <p class="tooltip-avatar">${name}</p>
         </div>
        <div class="avatarInfo">
          <a class="avatarName">${name}</a>
          <span class="blogsUploadTime">${new Date(publishedAt).toLocaleString()}</span>
        </div>
        <div class="follow" id="follow">
        <i class="fa-solid fa-user-plus"></i> Follow
        </div>
        <div class="unfollow" id="unfollow">
         <i class="fa-solid fa-user-minus"></i> Following
        </div>
      </div>
    </div>
    <div class="titleCont">
      <p class="blogCardTitle">${Title}</p>
    </div>
    <div class="imageCont">
      <img class="blogCardImg" src="${Image}" alt="blog image" />
    </div>
    <div class="likes-shares">
     <div class="likes"><i class="fa-solid fa-thumbs-up"></i> 1.1M</div>
     <div class="shares"> <i class="fa-solid fa-share"></i> 1.1m Shares</div>
    </div>
    <div class="blogItemsTag">
      <span class="likeBtn"><i class="fa-solid fa-thumbs-up"></i> Like</span>
      <a class="shareBtn" href="detail.html#${id}"><i class="fa-solid fa-share"></i> Share</a>
    </div>
  </div>
`;
}


const readData = async () => {
  spinner.style.display = "block";
  blog.style.display = "none";

  try {
    const data = await getData();
    if (data.empty) {
      blog.innerHTML = `<p class="noBlogFound">No blogs Found!</p>`;
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


setTimeout(() => {
  launchScreen.style.display = "none"
}, 500)