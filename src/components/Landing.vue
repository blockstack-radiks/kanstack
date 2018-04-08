<template lang="jade">
.hello
  div
    h1 Blockstack Kanban
    p
      | A decentralized Kanban board built on
      a(href="https://blockstack.org", target="_blank")  Blockstack
      |.
    button.btn.btn-secondary(@click.prevent="signIn") Sign In with Blockstack
    p.mt-2 A few cool features:
    ul
      li Offline friendly
      li Client-side encryption
      li Zippy fast
</template>

<script>
const blockstack = require('blockstack')

export default {
  name: 'landing',
  data () {
    return {
      blockstack: blockstack
    }
  },

  methods: {
    signIn () {
      const blockstack = this.blockstack
      blockstack.redirectToSignIn()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
