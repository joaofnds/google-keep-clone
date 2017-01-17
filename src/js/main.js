import Vue from 'vue'
import firebase from 'firebase'
import { getCurrentUser, currentUser, databaseRef } from './firebase-config'
import '../../node_modules/material-design-lite/material.min'
import '../sass/main.sass'

import Note from './components/Note.vue'
import Form from './components/NoteForm.vue'

const provider = new firebase.auth.GoogleAuthProvider();

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
			notes: []
		}
	},
	methods: {
		createNote(noteData) {
			databaseRef.push().set(noteData)
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
	mounted() {
		getCurrentUser.then( user => {
			this.user = user
			databaseRef.on('value', snap => {
				this.notes = snap.val()
			})
		})
	}
})
