"use strict";

var _firebaseApp = require("https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js");

var _firebaseFirestore = require("https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js");

var _firebaseAuth = require("https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js");

var firebaseConfig = {
  apiKey: "AIzaSyDQSx-_hYSNv4Q3o2tzg3SCei7FB3Xj9kM",
  authDomain: "create-blogs-5959e.firebaseapp.com",
  projectId: "create-blogs-5959e",
  storageBucket: "create-blogs-5959e.firebasestorage.app",
  messagingSenderId: "538886768958",
  appId: "1:538886768958:web:40c68aa806db23239e446f",
  measurementId: "G-NKZL02W59C"
};
var app = (0, _firebaseApp.initializeApp)(firebaseConfig);
var db = (0, _firebaseFirestore.getFirestore)(app);
var auth = (0, _firebaseAuth.getAuth)(app);
var blogRef = (0, _firebaseFirestore.collection)(db, "blogs");
var blog = document.querySelector("#blogging");
var spinner = document.querySelector("#spinner");
var launchScreen = document.getElementById("launch-screen");
var navAvatar = document.getElementById("nav-avatar");
var footerAvatar = document.getElementById("footer-avatar");
var leftSideAvatar = document.getElementById("left-side-avatar");
var leftSideAvatarName = document.getElementById("left-side-avatar-name");

var fetchCharacterByName = function fetchCharacterByName(name) {
  if (!name || typeof name !== "string") return "NA";
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(function (word) {
    return word[0].toUpperCase();
  }).join("");
};

(0, _firebaseAuth.onAuthStateChanged)(auth, function (user) {
  if (!user) {
    location.href = "index.html";
    return;
  }

  if (user.displayName) {
    try {
      var userName = fetchCharacterByName(user.displayName);
      if (navAvatar) navAvatar.innerText = userName;
      if (footerAvatar) footerAvatar.innerText = userName;
      if (leftSideAvatar) leftSideAvatar.innerText = userName;
      if (leftSideAvatarName) leftSideAvatarName.innerText = user.displayName;
    } catch (error) {
      console.error("Failed to fetch character name:", error);
    }
  }
});

var getData = function getData() {
  var blogData;
  return regeneratorRuntime.async(function getData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.getDocs)(blogRef));

        case 3:
          blogData = _context.sent;
          return _context.abrupt("return", blogData);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log("Error fetching blogs:", _context.t0);
          return _context.abrupt("return");

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var createCard = function createCard(cardDetail, id) {
  var Image = cardDetail.Image,
      Title = cardDetail.Title,
      publishedAt = cardDetail.publishedAt,
      name = cardDetail.name;
  return "\n  <div class=\"blogCardDiv\">\n    <div class=\"avatarWrapper\">\n      <div class=\"avatarDiv\">\n     <div class=\"avatar-container\">\n    <a class=\"avatar\">".concat(fetchCharacterByName(name), "</a>\n     <p class=\"tooltip-avatar\">").concat(name, "</p>\n         </div>\n        <div class=\"avatarInfo\">\n          <a class=\"avatarName\">").concat(name, "</a>\n          <span class=\"blogsUploadTime\">").concat(new Date(publishedAt).toLocaleString(), "</span>\n        </div>\n        <div class=\"follow\" id=\"follow\">\n        <i class=\"fa-solid fa-user-plus\"></i> Follow\n        </div>\n        <div class=\"unfollow\" id=\"unfollow\">\n         <i class=\"fa-solid fa-user-minus\"></i> Following\n        </div>\n      </div>\n    </div>\n    <div class=\"titleCont\">\n      <p class=\"blogCardTitle\">").concat(Title, "</p>\n    </div>\n    <div class=\"imageCont\">\n      <img class=\"blogCardImg\" src=\"").concat(Image, "\" alt=\"blog image\" />\n    </div>\n    <div class=\"likes-shares\">\n     <div class=\"likes\"><i class=\"fa-solid fa-thumbs-up\"></i> 1.1M</div>\n     <div class=\"shares\"> <i class=\"fa-solid fa-share\"></i> 1.1m Shares</div>\n    </div>\n    <div class=\"blogItemsTag\">\n      <span class=\"likeBtn\"><i class=\"fa-solid fa-thumbs-up\"></i> Like</span>\n      <a class=\"shareBtn\" href=\"detail.html#").concat(id, "\"><i class=\"fa-solid fa-share\"></i> Share</a>\n    </div>\n  </div>\n");
};

var readData = function readData() {
  var data;
  return regeneratorRuntime.async(function readData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          spinner.style.display = "block";
          blog.style.display = "none";
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(getData());

        case 5:
          data = _context2.sent;

          if (data.empty) {
            blog.innerHTML = "<p class=\"noBlogFound\">No blogs Found!</p>";
          } else {
            blog.innerHTML = data.docs.map(function (recData) {
              return createCard(recData.data(), recData.id);
            });
          }

          spinner.style.display = "none";
          blog.style.display = "flex";
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](2);
          console.log("Error reading data:", _context2.t0);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 11]]);
};

readData();
setTimeout(function () {
  launchScreen.style.display = "none";
}, 500);