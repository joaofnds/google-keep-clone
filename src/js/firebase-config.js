import firebase from 'firebase'

// Initialize Firebase
var config = {
	apiKey: "AIzaSyD3DB506Rnx7186JRJNN7e3sO21isyEWWU",
	authDomain: "project--1859386222849825921.firebaseapp.com",
	databaseURL: "https://project--1859386222849825921.firebaseio.com",
	storageBucket: "project--1859386222849825921.appspot.com",
	messagingSenderId: "256405949063"
};

firebase.initializeApp(config);

var databaseRef = null
var currentUser = null

export var getCurrentUser = new Promise( resolve => {
	firebase.auth().onAuthStateChanged(function (user) {
		currentUser = user
		databaseRef = firebase.database().ref(user.uid)
		if(user)
			resolve(user)
		else
			currentUser = null
	});
})

export { currentUser, databaseRef }