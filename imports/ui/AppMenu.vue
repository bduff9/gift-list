<template>
<div class="app-menu">
  <router-link :to="{ name:'home', exact: true }">Home</router-link>
  <router-link :to="{ name:'forum' }">Forum</router-link>
  <router-link :to="{ name:'apollo' }">Apollo</router-link>
</div>
</template>
