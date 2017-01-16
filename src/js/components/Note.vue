<template lang="pug">
	div.mdl-card.mdl-shadow--2dp
		.title {{notetitle}}
		.body {{notebody}}
</template>

<script>
	export default {
		props: ['notetitle', 'notebody']
	}
</script>

<style lang="sass">
	.mdl-card
		min-height: initial!important
		min-width: initial!important
		width: auto!important
		margin: 10px auto
		max-width: 512px
	
	.title
		padding: 10px 15px
		padding-bottom: 5px
		font-weight: bold
		font-size: 17px
		font-family: 'Roboto Condensed',arial,sans-serif
	.body
		padding: 15px
		padding-top: 5px
		resize: none
		font-size: 14px
		font-family: 'Roboto Slab','Times New Roman',serif
</style>