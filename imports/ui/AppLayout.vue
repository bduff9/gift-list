<template>
<div class="app-layout">
  <!-- Menu -->
  <app-menu v-if="userId"></app-menu>

  <!-- Route content -->
  <router-view></router-view>
</div>
</template>

<script>
import { Meteor } from 'meteor/meteor';

import AppMenu from '/imports/ui/AppMenu.vue';

export default {
  components: {
    AppMenu
  },
  data() {
    return {
      userId: Meteor.userId()
    };
  }
}
</script>
