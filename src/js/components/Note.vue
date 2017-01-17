<template lang="pug">
	div.mdl-card.mdl-shadow--2dp
		.row
			.title {{notetitle}}
			button.menu.mdl-button.mdl-js-button.mdl-button--icon.mdl-js-ripple-effect(@click='deleteNote')
				i.material-icons.mdl-color-text--grey-700 delete
		.body {{notebody}}
</template>

<script>
	export default {
		props: [ 'noteindex','notetitle', 'notebody'],
		methods: {
			deleteNote() {
				this.$emit('delete', this.noteindex)
			}
		}
	}
</script>

<style lang="sass">
	.mdl-card
		min-height: initial!important
		min-width: initial!important
		width: auto!important
		margin: 10px auto
		max-width: 512px
		overflow: visible

	.row
		padding: 10px 15px
		padding-bottom: 5px
		.title
			display: inline-block
			font-weight: bold
			font-size: 17px
			font-family: 'Roboto Condensed',arial,sans-serif
		.menu
			float: right
	.body
		padding: 15px
		padding-top: 5px
		resize: none
		font-size: 14px
		font-family: 'Roboto Slab','Times New Roman',serif
</style>