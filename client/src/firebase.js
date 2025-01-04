import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "",
  authDomain: "bankingapp-70adb.firebaseapp.com",
  projectId: "bankingapp-70adb",
  storageBucket: "bankingapp-70adb.firebasestorage.app",
  messagingSenderId: "747066015843",
  appId: "1:747066015843:web:ff3d87bbddd806998a3856"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
