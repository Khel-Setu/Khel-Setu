// Import the core Firebase app
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";

// Import Authentication and Firestore (Database)
import { getAuth } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBxD2np3jCdfn0NWPDSAQA_2yDYylF2l74",
    authDomain: "khelsetu-sfic-seva.firebaseapp.com",
    projectId: "khelsetu-sfic-seva",
    storageBucket: "khelsetu-sfic-seva.firebasestorage.app",
    messagingSenderId: "966586969099",
    appId: "1:966586969099:web:7e635963b153272bcaab0e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export them so auth.js, booking.js, admin.js, and moderator.js can use them
export { auth, db };