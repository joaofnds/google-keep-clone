'use strict';

import Vue from 'vue'
import firebase from 'firebase'
import { getCurrentUser, currentUser, databaseRef } from './firebase-config'
import '../../node_modules/material-design-lite/material.min'
import '../sass/main.sass'

import Note from './components/Note.vue'
import Form from './components/NoteForm.vue'

const provider = new firebase.auth.GoogleAuthProvider()
var editNote

(() => {

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
			notes: [],
			editMode: false,
			editNoteIndex: '',
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

			if(this.user) {
				databaseRef.child(index).remove()

				showNotification("Note deleted", 3000, "UNDO", () => {
					let snackbar = document.querySelector('#snackbar')
					snackbar.classList.remove('mdl-snackbar--active')
					databaseRef.child(index).set(deletednote)
				})
			} else {
				this.notes.splice(index, 1)
				
				showNotification("Note deleted", 3000, "UNDO", () => {
					let snackbar = document.querySelector('#snackbar')
					snackbar.classList.remove('mdl-snackbar--active')
					this.notes.push(deletednote)
				})
			}
		},
		editNote(index) {
			this.editMode = true
			this.editNoteIndex = index
			let note = this.notes[index]
			this.$refs.editForm._data.title = note.title
			this.$refs.editForm._data.body = note.body
		},
		updateNote(noteData) {
			this.editMode = false

			databaseRef.child(this.editNoteIndex).set(noteData)
			this.editNoteIndex = ''
		},
		cancelUpdateNote(e) {
			if ( (e.target.tagName == "DIV" || e.target.tagName == "SPAN") && this.editMode){
				this.editMode = false
				this.$refs.editForm._data.title = ''
				this.$refs.editForm._data.body = ''
			}
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
		this.$nextTick(() => {
			componentHandler.upgradeDom();
		});
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