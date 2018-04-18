<template lang="jade">
div.h-100
  .hello
    div
      h1 Kanstack
      p
        | A decentralized Kanban board built on
        a(href="https://blockstack.org", target="_blank")  Blockstack
        |.
      button.btn.btn-secondary(@click.prevent="signIn") Sign In with Blockstack
      p.mt-2 A few cool features:
      ul
        li Offline friendly
        li Client-side encryption
        li
          a(href="https://github.com/hstove/kanstack", target="blank") Open Source

  .container
    .row.mt-3.mb-3
      .col-md-8.col-xs-12.mt-3.mb-3
        h1.display-3.mb-3 Offline Friendly
        h4.mt-3
          | Your encrypted data is stored locally in your browser, so that if you
          | lose your internet connection, you can still use Kanstack. When you re-connect,
          | your data will be synced with Blockstack's distributed storage.
      .col-md-4.d-none.d-md-block
        h1.display-1.text-center.mt-3
          .space-1
          font-awesome-icon(:icon="powerOffIcon")

    .row.mt-3.mb-3
      .col-md-4.d-none.d-md-block
        h1.display-1.text-center.mt-3
          .space-1
          font-awesome-icon(:icon="lockIcon")
      .col-md-8.col-xs-12.mt-3.mb-3
        h1.display-3.mb-3 Client Side Encryption
        h4.mt-3
          | Before any of your data is saved on your computer or on Blockstack's decentralized
          | cloud, your data is encrypted using an app-specific private key that only you can see.

    .row.mt-3.mb-3
      .col-md-8.col-xs-12.mt-3.mb-3
        h1.display-3.mb-3 Fast and Responsive
        h4.mt-3
          | Because your data doesn't have to wait to sync with the cloud, saving and updating
          | your boards happens instantly. In the background, we silently keep things synced with Blockstack,
          | so that you can pick up where you left off on a different computer.
      .col-md-4.d-none.d-md-block
        h1.display-1.text-center.mt-3
          .space-1
          font-awesome-icon(:icon="rocketIcon")
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import powerOffIcon from '@fortawesome/fontawesome-free-solid/faPowerOff'
import lockIcon from '@fortawesome/fontawesome-free-solid/faLock'
import rocketIcon from '@fortawesome/fontawesome-free-solid/faSpaceShuttle'
const blockstack = require('blockstack')

export default {
  name: 'landing',
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      blockstack: blockstack,
      powerOffIcon,
      lockIcon,
      rocketIcon
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
  background: linear-gradient(to right, rgba(255,255,255,0.6) 20%,
              rgba(255,255,255,1)), url('/asoggetti.jpg');
  background-size: cover;
  font-weight: 500;
}
</style>
