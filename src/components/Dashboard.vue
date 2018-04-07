<template lang="jade">
div
  b-navbar(toggleable="md", type="light", variant="light")
    b-navbar-toggle(target="nav_collapse")
    b-navbar-brand KanStack
    b-collapse(is-nav, id="nav_collapse")
      b-navbar-nav
        b-nav-item(to="/boards/new") New Board
</template>

<script>
export default {
  data () {
    return {

    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

input::placeholder {
  color: grey;
}

label {
  margin-bottom: 0;
  // width: 100%;
  cursor: pointer;
  input[type="checkbox"] {
    margin-right: 5px;
  }
}
.list-group-item {
  &.completed label {
    text-decoration: line-through;
  }

  .delete {
    display: none;
  }

  &:hover .delete {
    display: inline;
    color: grey;
    &:hover {
      text-decoration: none;
      color: red;
    }
  }
}
</style>
