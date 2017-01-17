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

	watch: {
		user: function() {
			this.$nextTick(() => {
				componentHandler.upgradeDom();
			});

			if(this.user) {
				if(this.notes != []) {
					this.notes.forEach( k => { databaseRef.push().set(k) })
				}
				showNotification("Signed in!", 2000)
				databaseRef.on('value', snap => {
					this.notes = snap.val()
				})
			} else {
				showNotification("Signed out!", 2000)
			}

		},
		notes: function() {
			this.$nextTick(() => {
				componentHandler.upgradeDom();
			});
		}
	},

	methods: {
		createNote(noteData) {
			if(!currentUser) {
				this.notes.push(noteData)
			} else {
				databaseRef.push().set(noteData)
			}
		},
		deletenote(index) {
			let deletednote = this.notes[index]
			databaseRef.child(index).remove()

			showNotification("Note deleted", 3000, "UNDO", () => {
				let snackbar = document.querySelector('#snackbar')
				snackbar.classList.remove('mdl-snackbar--active')
				databaseRef.child(index).set(deletednote)
			})
		},
		signIn() {
			let context = this
			firebase.auth().signInWithPopup(provider).then(function(result) {
				context.user = result.user
			}).catch(function(error) {
				console.log(error.code)
				console.log(error.message)
			});
		},
		signOut() {
			let context = this
			firebase.auth().signOut().then(function() {
				context.user = null
				context.notes = []
			}, function(error) {
				console.log('error signing out')
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
		})
	}
})

function showNotification(text, time, actionText, callback) {
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