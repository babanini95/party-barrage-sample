import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const isTestProject: boolean = true;
// party barrage config
const realConfig = {
  apiKey: "AIzaSyBS-pvy22Up-GIiQY8ibQRWBeY_mIRenPM",
  authDomain: "battle-barrage.firebaseapp.com",
  databaseURL: "https://battle-barrage-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "battle-barrage",
  storageBucket: "battle-barrage.appspot.com",
  messagingSenderId: "27586835596",
  appId: "1:27586835596:web:773ee5c26517c11aecb7a9",
  measurementId: "G-F9RGB0GWYW"
};

// test project config
const testConfig = {
  apiKey: "AIzaSyAH_qc_CK-38aATCOLRkztiIDQsj2ug6mo",
  authDomain: "test-project-9f7e1.firebaseapp.com",
  projectId: "test-project-9f7e1",
  storageBucket: "test-project-9f7e1.firebasestorage.app",
  messagingSenderId: "518119497282",
  appId: "1:518119497282:web:c560c1c6afc323baf797db",
  measurementId: "G-LF1L6DPGZ6"
};

const firebaseApp = initializeApp(isTestProject ? testConfig : realConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };