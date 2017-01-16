<template lang="pug">
	form#createNoteForm.mdl-card.mdl-shadow--2dp(@submit.prevent='createNote')
		input.noteTitle(type='text', v-model='title', name='title', placeholder='Title', required='')
		textarea.noteBody(v-model='body', name='body', placeholder='Take a note...', required='')
		button#submitButton.mdl-button.mdl-js-button.mdl-js-ripple-effect.mdl-color-text--grey-800 Done
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				body: ''
			}
		},
		methods: {
			createNote: function() {
				this.$emit('newnote', { title: this.title, body: this.body })
				this.title = this.body = ''
			}
		}
	}
</script>

<style lang="sass">
	form
		min-height: initial!important
		min-width: initial!important
		width: auto!important
		margin: 0px auto
		max-width: 512px

		.noteTitle
			outline: none!important
			border: none!important
			padding: 10px 15px
			font-weight: bold
			font-size: 17px
			font-family: 'Roboto Condensed',arial,sans-serif
		
		.noteBody
			outline: none!important
			border: none!important
			padding: 15px
			resize: none
			font-size: 14px
			font-family: 'Roboto Slab','Times New Roman',serif

		#submitButton
			width: 80px
			margin: 10px 15px
			margin-top: 0px
			margin-left: auto
		font-weight: 600
</style>