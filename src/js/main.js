import Vue from 'vue';
import firebase from 'firebase';
import { getCurrentUser, currentUser, databaseRef } from './firebase-config';
import '../lib/mdl/material';
import '../sass/main.sass';

import Note from './components/Note.vue';
import Form from './components/NoteForm.vue';

const provider = new firebase.auth.GoogleAuthProvider();

function showNotification(text, time, actionText, callback) {
  const snackbar = document.querySelector('#snackbar');
  const notificationData = {
    message: text,
    actionHandler: callback || (() => { snackbar.MaterialSnackbar.hideSnackbar(); }),
    actionText: actionText || 'DISMISS',
    timeout: time || 2500,
  };
  if (snackbar.MaterialSnackbar) { snackbar.MaterialSnackbar.showSnackbar(notificationData); }
}

const app = new Vue({
  el: '#app',
  components: {
    'note-form': Form,
    note: Note,
  },

  data() {
    return {
      user: null,
      notes: [],
      editMode: false,
      editNoteIndex: null,
    };
  },

  watch: {
    user() {
      this.$nextTick(() => {
        componentHandler.upgradeDom();
      });

      if (this.user) {
        if (this.notes !== []) {
          this.notes.forEach((k) => { databaseRef.push().set(k); });
        }
        showNotification('Signed in!', 20000);
        databaseRef.on('value', (snap) => {
          this.notes = snap.val();
        });
      } else {
        showNotification('Signed out!', 2000);
      }
    },
    notes() {
      this.$nextTick(() => {
        componentHandler.upgradeDom();
      });
    },
  },

  methods: {
    createNote(noteData) {
      if (!currentUser) {
        this.notes.push(noteData);
      } else {
        databaseRef.push().set(noteData);
      }
    },

    deletenote(index) {
      const deletednote = this.notes[index];

      if (this.user) {
        databaseRef.child(index).remove();

        showNotification('Note deleted', 3000, 'UNDO', () => {
          document.querySelector('#snackbar').MaterialSnackbar.hideSnackbar();
          databaseRef.child(index).set(deletednote);
        });
      } else {
        this.notes.splice(index, 1);

        showNotification('Note deleted', 3000, 'UNDO', () => {
          document.querySelector('#snackbar').MaterialSnackbar.hideSnackbar();
          this.notes.push(deletednote);
        });
      }
    },
    editNote(index) {
      this.editMode = true;
      this.editNoteIndex = index;
      const note = this.notes[index];
      this.$refs.editForm._data.title = note.title;
      this.$refs.editForm._data.body = note.body;
      setTimeout((_) => {
        this.$refs.editForm._data.body = `${note.body} `;
      }, 1);
    },
    updateNote(noteData) {
      this.editMode = false;
      if (this.user) {
        databaseRef.child(this.editNoteIndex).set(noteData);
      } else {
        this.notes[this.editNoteIndex] = noteData;
      }

      this.editNoteIndex = null;
    },
    cancelUpdateNote(e) {
      if ((e.target.id == 'noteEditObfuscator' || e.target.parentElement.id == 'noteEditClose') && this.editMode) {
        this.editMode = false;
        this.editNoteIndex = null;
        this.$refs.editForm._data.title = '';
        this.$refs.editForm._data.body = '';
      }
    },
    signIn() {
      const context = this;
      firebase.auth().signInWithPopup(provider).then((result) => {
        context.user = result.user;
      }).catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
    },
    signOut() {
      const context = this;
      firebase.auth().signOut().then(() => {
        context.user = null;
        context.notes = [];
      }, (error) => {
        console.log('error signing out');
      });
    },
    leave(el, done) {
      const top = `${el.offsetTop}px`;
      const left = `${el.offsetLeft}px`;
      const height = `${el.clientHeight}px`;
      const width = `${el.clientWidth}px`;
      el.style.transform = 'scale(0)';
      el.style.position = 'absolute';
      el.style.top = top;
      el.style.left = left;
      el.style.height = height;
      el.style.width = width;
      el.style.opacity = 0;
    },
  },

  ready() {
    this.$nextTick(() => {
      componentHandler.upgradeDom();
    });
  },

  mounted() {
    getCurrentUser.then((user) => {
      this.user = user;
    });
    this.$nextTick(() => {
      componentHandler.upgradeDom();
    });
  },
});
