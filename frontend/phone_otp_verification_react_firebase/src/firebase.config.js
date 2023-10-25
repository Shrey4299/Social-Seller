// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBLfuOQhtQNrkDR0PKOmgSksPACRZilqdk",
  authDomain: "otp-project-6c8bb.firebaseapp.com",
  projectId: "otp-project-6c8bb",
  storageBucket: "otp-project-6c8bb.appspot.com",
  messagingSenderId: "719976557656",
  appId: "1:719976557656:web:67b22502545787af022e2d",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const auth = getAuth(app);
