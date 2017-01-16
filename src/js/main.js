import Vue from 'vue'
import Firebase from '../../node_modules/firebase/firebase'
import '../../node_modules/material-design-lite/material.min'
import '../sass/main.sass'

import Note from './components/Note.vue'
import Form from './components/NoteForm.vue'

const app = new Vue({
	el: '#app',
	components: {
		'note-form': Form,
		'note': Note
	},
	data() {
		return {
			notes: [
				{ title: 'foo', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla mollitia corporis eveniet asperiores cum praesentium libero, iure odio, ducimus, distinctio ex recusandae vero sunt magni! Praesentium quos nesciunt error cumque.' },
				{ title: 'foo', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla mollitia corporis eveniet asperiores cum praesentium libero, iure odio, ducimus, distinctio ex recusandae vero sunt magni! Praesentium quos nesciunt error cumque.' },
				{ title: 'foo', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla mollitia corporis eveniet asperiores cum praesentium libero, iure odio, ducimus, distinctio ex recusandae vero sunt magni! Praesentium quos nesciunt error cumque.' },
				{ title: 'foo', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla mollitia corporis eveniet asperiores cum praesentium libero, iure odio, ducimus, distinctio ex recusandae vero sunt magni! Praesentium quos nesciunt error cumque.' },
			]
		}
	},
	methods: {
		createNote(noteData) {
			this.notes.push(noteData)
		}
	}
})