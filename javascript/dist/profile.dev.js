"use strict";

var _firebaseApp = require("https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js");

var _firebaseFirestore = require("https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js");

var _firebaseAuth = require("https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js");

var firebaseConfig = {
  apiKey: "AIzaSyDQSx-_hYSNv4Q3o2tzg3SCei7FB3Xj9kM",
  authDomain: "create-blogs-5959e.firebaseapp.com",
  projectId: "create-blogs-5959e",
  storageBucket: "create-blogs-5959e.appspot.com",
  messagingSenderId: "538886768958",
  appId: "1:538886768958:web:40c68aa806db23239e446f"
};
var app = (0, _firebaseApp.initializeApp)(firebaseConfig);
var db = (0, _firebaseFirestore.getFirestore)(app);
var auth = (0, _firebaseAuth.getAuth)(app);
var blog = document.querySelector("#blogging");
var spinner = document.querySelector("#spinner");
var userName = document.getElementById("user-name");
var profileImage = document.getElementById("profileImage");

var fetchCharacterByName = function fetchCharacterByName(name) {
  if (!name || typeof name !== "string") return "NA";
  return name.trim().split(/\s+/).filter(function (word) {
    return /^[a-zA-Z]+$/.test(word);
  }).slice(0, 2).map(function (word) {
    return word[0].toUpperCase();
  }).join("");
};

var createCard = function createCard(cardDetail, id) {
  var Image = cardDetail.Image,
      Title = cardDetail.Title,
      _cardDetail$published = cardDetail.publishedAt,
      publishedAt = _cardDetail$published === void 0 ? new Date().toISOString() : _cardDetail$published,
      name = cardDetail.name;
  return "\n  <div class=\"blogCardDiv\">\n    <div class=\"avatarWrapper\">\n      <div class=\"avatarDiv\">\n     <div class=\"avatar-container\">\n    <a class=\"avatar\">".concat(fetchCharacterByName(name), "</a>\n     <p class=\"tooltip-avatar\">").concat(name, "</p>\n         </div>\n        <div class=\"avatarInfo\">\n          <a class=\"avatarName\">").concat(name, "</a>\n          <span class=\"blogsUploadTime\">").concat(new Date(publishedAt).toLocaleString(), "</span>\n        </div>\n      </div>\n    </div>\n    <div class=\"titleCont\">\n      <p class=\"blogCardTitle\">").concat(Title, "</p>\n    </div>\n    <div class=\"imageCont\">\n      <img class=\"blogCardImg\" src=\"").concat(Image, "\" alt=\"blog image\" />\n    </div>\n    <div class=\"likes-shares\">\n     <div class=\"likes\"><i class=\"fa-solid fa-thumbs-up\"></i> 1.1M</div>\n     <div class=\"shares\"> <i class=\"fa-solid fa-share\"></i> 1.1m Shares</div>\n    </div>\n    <div class=\"blogItemsTag\">\n      <span class=\"likeBtn\"><i class=\"fa-solid fa-thumbs-up\"></i> Like</span>\n      <a class=\"shareBtn\" href=\"detail.html#").concat(id, "\"><i class=\"fa-solid fa-share\"></i> Share</a>\n    </div>\n  </div>\n");
};

window.onDelete = function _callee(id) {
  var confirmDelete;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          confirmDelete = confirm("Are you sure you want to delete?");

          if (!confirmDelete) {
            _context.next = 13;
            break;
          }

          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.deleteDoc)((0, _firebaseFirestore.doc)(db, "blogs", id)));

        case 5:
          alert("Blog deleted successfully!");
          location.reload();
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](2);
          console.log("Error deleting blog:", _context.t0);
          alert("Error deleting blog.");

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

window.onUpdate = function (id) {
  window.location.href = "update.html#".concat(id);
};

(0, _firebaseAuth.onAuthStateChanged)(auth, function _callee2(user) {
  var userAvatar, collectionRef, qRef, customQuery, querySnapshot;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!user) {
            location.href = "index.html";
          }

          if (user.displayName) {
            userAvatar = fetchCharacterByName(user.displayName);
            profileImage.innerText = userAvatar;
            userName.innerText = user.displayName;
          }

          if (!user) {
            _context2.next = 22;
            break;
          }

          spinner.style.display = "block";
          blog.style.display = "none";
          _context2.prev = 5;
          collectionRef = (0, _firebaseFirestore.collection)(db, "blogs");
          qRef = (0, _firebaseFirestore.where)("uid", "==", user.uid);
          customQuery = (0, _firebaseFirestore.query)(collectionRef, qRef);
          _context2.next = 11;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.getDocs)(customQuery));

        case 11:
          querySnapshot = _context2.sent;

          if (querySnapshot.empty) {
            blog.innerHTML = "<p class= \"noBlogFound\">No blogs found.</p>";
          } else {
            querySnapshot.forEach(function (docSnap) {
              var data = docSnap.data();
              var card = createCard(data, docSnap.uid);
              blog.innerHTML += card;
            });
          }

          spinner.style.display = "none";
          blog.style.display = "flex";
          _context2.next = 22;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](5);
          console.log("Error getting blogs:", _context2.t0);
          _context2.next = 22;
          return regeneratorRuntime.awrap(Swal.fire({
            icon: "error",
            title: "Error Getting User Blogs"
          }));

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 17]]);
});