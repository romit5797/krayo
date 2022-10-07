// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP3Q7YXJ_GowIIL1FFp-A7uHFJnuHZOzM",
  authDomain: "krayo-b818c.firebaseapp.com",
  projectId: "krayo-b818c",
  storageBucket: "krayo-b818c.appspot.com",
  messagingSenderId: "515613983115",
  appId: "1:515613983115:web:64866c7fef7d0320c82f8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const signWithGoogle = () =>  window.innerWidth <= 768 ? signInWithRedirect(auth, provider) : signInWithPopup(auth, provider);
export const getLoginResult = () => getRedirectResult(auth)