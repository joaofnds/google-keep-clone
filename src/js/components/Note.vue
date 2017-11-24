<template lang="pug">
  div.mdl-card.mdl-shadow--2dp.mdl-cell.mdl-cell--3-col-desktop.mdl-cell--4-col-tablet.mdl-cell--12-col-phone
    .row
      .title {{notetitle}}
      button.menu.mdl-button.mdl-js-button.mdl-button--icon.mdl-js-ripple-effect(:id="noteindex")
        i.material-icons.mdl-color-text--grey-700 more_vert
      ul.mdl-menu.mdl-menu--bottom-right.mdl-js-menu.mdl-js-ripple-effect(:for='noteindex')
        li.mdl-menu__item(@click='editNote') Edit
        li.mdl-menu__item(@click='deleteNote') Delete
    .body {{notebody}}
</template>

<script>
  export default {
    props: ['noteindex', 'notetitle','notebody'],

    ready () {
      this.$nextTick(() => {
        componentHandler.upgradeDom();
      });
    },

    methods: {
      deleteNote() {
        this.$emit('delete', this.noteindex)
      },
      editNote() {
        this.$emit('edit', this.noteindex)
      }
    }
  }
</script>

<style lang="sass">
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