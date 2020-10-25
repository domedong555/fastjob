import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC5zVdITdz-bhzFnx7pFR-d4BvrCnIJDsc",
  authDomain: "fast-job-a3af1.firebaseapp.com",
  databaseURL: "https://fast-job-a3af1.firebaseio.com",
  projectId: "fast-job-a3af1",
  storageBucket: "fast-job-a3af1.appspot.com",
  messagingSenderId: "645331605666",
  appId: "1:645331605666:web:ba161e3702fc61bd39dffb",
  measurementId: "G-LESS5E7Y5P"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
