import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJByju4GG7XB-EUvAsLqxEHbbzquM2mdw",
  authDomain: "vcniti-phone-auth.firebaseapp.com",
  projectId: "vcniti-phone-auth",
  storageBucket: "vcniti-phone-auth.firebasestorage.app",
  messagingSenderId: "567929547048",
  appId: "1:567929547048:web:5f2720d8c1adf61d4fc81d",
  measurementId: "G-6RX3FRRCWH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };