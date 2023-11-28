// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXajxaDJXAELTVpoPn7iqpIUaXqAdRh3o",
  authDomain: "pronunciationtutor-a41b3.firebaseapp.com",
  projectId: "pronunciationtutor-a41b3",
  storageBucket: "pronunciationtutor-a41b3.appspot.com",
  messagingSenderId: "1042363336925",
  appId: "1:1042363336925:web:c9bb75ba8328e323e53334"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
}
else {
    app = firebase.app();
}

const auth = firebase.auth();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
