<template lang="jade">
#app
  landing(v-if='!user')
  div(v-if="user")
    b-navbar(toggleable="md", type="light", variant="light")
      b-navbar-toggle(target="nav_collapse")
      b-navbar-brand(to="/") KanStack
      b-collapse(is-nav, id="nav_collapse")
        b-navbar-nav
          b-nav-item(to="/boards/new") New Board
  router-view
    small.creds
      | Source code on
      a(href='https://github.com/blockstack/blockstack-todos', target='_blank') Github

</template>

<script>

import Landing from './components/Landing.vue'
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'app',
  components: {Landing, Dashboard},
  mounted () {
    const { blockstack } = window
    if (blockstack.isUserSignedIn()) {
      this.userData = blockstack.loadUserData()
      this.user = new blockstack.Person(this.userData.profile)
      this.user.username = this.userData.username
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn()
      .then((userData) => {
        window.location = window.location.origin
      })
    }
  },
  data () {
    return {
      user: null,
      blockstack: window.blockstack
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
