import firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyD3DB506Rnx7186JRJNN7e3sO21isyEWWU',
  authDomain: 'project--1859386222849825921.firebaseapp.com',
  databaseURL: 'https://project--1859386222849825921.firebaseio.com',
  storageBucket: 'project--1859386222849825921.appspot.com',
  messagingSenderId: '256405949063',
};

firebase.initializeApp(config);

let databaseRef = null;
let currentUser = null;

export const getCurrentUser = new Promise((resolve) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      databaseRef = firebase.database().ref(user.uid);
      resolve(user);
    } else {
      currentUser = null;
      databaseRef = null;
    }
  });
});

export { currentUser, databaseRef };
