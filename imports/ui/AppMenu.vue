<template>
<div class="app-menu">
  <router-link :to="{ name: 'home' }" exact>Home</router-link>
  <router-link :to="{ name: 'my-list' }" exact>My List</router-link>
  <router-link to="my-list2">Bad Link</router-link>
</div>
</template>

<style scoped lang="scss">
  @import "./colors.scss";

  .app-menu {
    margin: 32px 0;
    text-align: center;

    a {
      display: inline-block;
      padding: 6px;
      margin: 0 6px;
      border-radius: 3px;

      &.router-link-active {
        background: $app-color;
        color: white;
        text-decoration: none;
        cursor: text;
      }
    }
  }
</style>
