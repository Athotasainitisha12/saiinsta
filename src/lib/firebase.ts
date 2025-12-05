import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBdaTy9a2BQU5vYQ7NhmyDMp5DEZIXTehk",
  authDomain: "instagrama-cfafe.firebaseapp.com",
  projectId: "instagrama-cfafe",
  storageBucket: "instagrama-cfafe.firebasestorage.app",
  messagingSenderId: "756539608340",
  appId: "1:756539608340:web:911265afbb1dbeaa858601",
  measurementId: "G-ZLGM8JJ2MV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
