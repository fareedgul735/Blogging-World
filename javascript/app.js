import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
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
const auth = getAuth(app);

let signUpBtn = document.getElementById("signUpBtn");
let logInButton = document.getElementById("logInBtn");

const redirectSignup = document.getElementById("redirect-signup");
const redirectSignin = document.getElementById("redirect-signin");
const signinWrapper = document.getElementById("login-wrapper")
const signupWrapper = document.getElementById("signup-wrapper")

redirectSignup.addEventListener("click", () => {
  signupWrapper.style.display = "block"
  signinWrapper.style.display = "none"
})
redirectSignin.addEventListener("click", () => {
  signinWrapper.style.display = "block"
  signupWrapper.style.display = "none"
})

onAuthStateChanged(auth, (user) => {
  if (user) location.href = "home.html"
})

const onSignUp = async (e) => {
  e.preventDefault();
  let userName = document.getElementById("userName");
  let verifyEmail = document.getElementById("signUpEmail");
  let verifyPassword = document.getElementById("signUpPassword");
  const regex = /^[a-zA-Z0-9 ]{3,30}$/;
  if (!regex.test(userName.value)) {
    console.log("❌ Invalid username");
    await Swal.fire({
      icon: "error",
      text: "❌ Invalid Username! Please use only letters and numbers (3-20 characters)."
    })
    return
  } else {
    console.log("✅ Valid username");
  }


  let inputsArray = [userName, verifyEmail, verifyPassword];
  inputsArray.forEach(
    (inputField) => (inputField.style.border = "1px solid blue")
  );

  let fieldIsEmpty = inputsArray.some(
    (inputField) => inputField.value.trim() === ""
  );

  if (fieldIsEmpty) {
    inputsArray.forEach((inputField) => {
      if (inputField.value.trim() === "") {
        inputField.style.border = "1px solid red";
      }
    });
  } else {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        verifyEmail.value,
        verifyPassword.value
      );
      await updateProfile(response.user, {
        displayName: userName?.value,
      });
      userName.value = "";
      verifyEmail.value = "";
      verifyPassword.value = "";
      location.href = "home.html";
      inputsArray.forEach(
        (inputField) => (inputField.style.border = "1px solid gray")
      );
    } catch (error) {
      console.log(error);
      inputsArray.forEach(
        (inputField) => (inputField.style.border = "1px solid red")
      );
    }
  }
};
signUpBtn.addEventListener("click", onSignUp);


const onLogIn = async (e) => {
  e.preventDefault();
  let logInEmail = document.getElementById("logInEmail");
  let logInPassword = document.getElementById("logInPassword");

  let inputsArray = [logInEmail, logInPassword];

  inputsArray.forEach((inputField) => {
    inputField.style.border = "1px solid blue";
  });

  let fieldIsEmpty = inputsArray.some(
    (inputField) => inputField.value.trim() === ""
  );

  if (fieldIsEmpty) {
    inputsArray.forEach((inputField) => {
      if (inputField.value.trim() === "") {
        inputField.style.border = "1px solid red";
      }
    });
  } else {
    try {
      await signInWithEmailAndPassword(
        auth,
        logInEmail.value,
        logInPassword.value
      );

      logInEmail.value = "";
      logInPassword.value = "";
      inputsArray.forEach((inputField) => {
        inputField.style.border = "1px solid gray";
      });
      location.href = "home.html";
    } catch (e) {
      console.log(e);
      inputsArray.forEach((inputField) => {
        inputField.style.border = "1px solid red";
      });
    }
  }
};

logInButton.addEventListener("click", onLogIn);