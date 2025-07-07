import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
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
const userName = document.getElementById("user-name")
const profileImage = document.getElementById("profileImage")

const fetchCharacterByName = (name) => {
    if (!name || typeof name !== "string") return "NA";

    return name
        .trim()
        .split(/\s+/)
        .filter(word => /^[a-zA-Z]+$/.test(word))
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("");
};


const createCard = (cardDetail, id) => {
    const {
        Image,
        Title,
        publishedAt = new Date().toISOString(),
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


onAuthStateChanged(auth, async (user) => {
    if (!user) {
        location.href = "index.html"
    }
    if (user.displayName) {
        const userAvatar = fetchCharacterByName(user.displayName);
        profileImage.innerText = userAvatar;
        userName.innerText = user.displayName
    }
    if (user) {
        spinner.style.display = "block";
        blog.style.display = "none";

        try {
            const collectionRef = collection(db, "blogs");
            const qRef = where("uid", "==", user.uid);
            const customQuery = query(collectionRef, qRef)
            const querySnapshot = await getDocs(customQuery);

            if (querySnapshot.empty) {
                blog.innerHTML = `<p class= "noBlogFound">No blogs found.</p>`;
            } else {
                querySnapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    const card = createCard(data, docSnap.uid);
                    blog.innerHTML += card;
                });
            }
            spinner.style.display = "none";
            blog.style.display = "flex";

        } catch (error) {
            console.log("Error getting blogs:", error);
            await Swal.fire({
                icon: "error",
                title: "Error Getting User Blogs"
            })
        }
    }
});