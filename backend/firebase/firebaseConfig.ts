import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWc_3OOHRq81cpPh5SCkOLeHyfa3yqvLU",
  authDomain: "paw-projekt-4cff3.firebaseapp.com",
  databaseURL: "https://paw-projekt-4cff3-default-rtdb.firebaseio.com",
  projectId: "paw-projekt-4cff3",
  storageBucket: "paw-projekt-4cff3.appspot.com",
  messagingSenderId: "395971955498",
  appId: "1:395971955498:web:2db02cba13df20c1be6c53",
  measurementId: "G-K99TC7CDC6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;
