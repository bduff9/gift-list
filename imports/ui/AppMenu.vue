<template>
  <div class="app-menu">
    <router-link :to="{ name: 'home' }" exact>Home</router-link>
    <router-link :to="{ name: 'my-list' }">My Gift List</router-link>
    <router-link :to="{ name: 'other-lists' }">View Others' Lists</router-link>
    <router-link :to="{ name: 'shopping-list' }">My Shopping List</router-link>
    <router-link :to="{ name: 'settings' }">Settings</router-link>
    <router-link to="/logout">Sign Out</router-link>
  </div>
</template>

<style lang="scss">
  @import "./_colors.scss";

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
