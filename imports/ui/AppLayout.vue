<template>
<section class="section app-layout">
  <div class="container">
  <!-- Menu -->
  <app-menu v-if="userId"></app-menu>

  <!-- Route content -->
  <router-view></router-view>
  </div>
</section>
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
