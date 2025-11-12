import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCBwAIU4ZMxLxf0INZxpyfvZfpOiqdlD1U",
  authDomain: "ai-recipie-chatbot.firebaseapp.com",
  projectId: "ai-recipie-chatbot",
  storageBucket: "ai-recipie-chatbot.firebasestorage.app",
  messagingSenderId: "1058280180685",
  appId: "1:1058280180685:web:77b3e5c982674851315284",
  measurementId: "G-4BPMWEJMFN"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
