// Import Firebase App
import { initializeApp } from "firebase/app";
// Import Firebase Storage
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKvqfrIN2IpPYrSdJinh6ElHf4b3hJQHw",
  authDomain: "accessguard-418319.firebaseapp.com",
  projectId: "accessguard-418319",
  storageBucket: "accessguard-418319.appspot.com",
  messagingSenderId: "309575466743",
  appId: "1:309575466743:web:b0dca5fd5b19ebe0a49df2",
  measurementId: "G-37J86CDCKG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(app);

export { storage, ref };
