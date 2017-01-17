import Vue from 'vue'
import firebase from 'firebase'
import { getCurrentUser, currentUser, databaseRef } from './firebase-config'
import '../../node_modules/material-design-lite/material.min'
import '../sass/main.sass'

import Note from './components/Note.vue'
import Form from './components/NoteForm.vue'

const provider = new firebase.auth.GoogleAuthProvider()
var snackbar

(() => {
	snackbar = document.getElementById('snackbar')
	window.foo = snackbar
})()

const app = new Vue({
	el: '#app',
	components: {
		'note-form': Form,
		'note': Note
	},

	data() {
		return {
			user: null,
			notes: []
		}
	},

	methods: {
		createNote(noteData) {
			if(!currentUser) {
				showNotification("You need to login first!", 2500)
			} else {
				databaseRef.push().set(noteData)
			}
		},
		signIn() {
			firebase.auth().signInWithPopup(provider).then(function(result) {
				this.user = result.user
			}).catch(function(error) {
				console.log(error.code)
				console.log(error.message)
			});
		}
	},

	ready () {
		this.$nextTick(() => {
			componentHandler.upgradeDom();
		});
	},

	mounted() {
		getCurrentUser.then( user => {
			this.user = user
			databaseRef.on('value', snap => {
				this.notes = snap.val()
			})
		})
	}
})

export function showNotification(text, time, actionText, callback) {
	let snackbar = document.querySelector('#snackbar')
	let notificationData = {
		message: text,
		actionHandler: callback ? callback : (e) => { snackbar.classList.remove('mdl-snackbar--active') },
		actionText: actionText ? actionText : "DISMISS",
		timeout: time ? time : 2500
	}
	if(snackbar.MaterialSnackbar)
		snackbar.MaterialSnackbar.showSnackbar(notificationData)
}