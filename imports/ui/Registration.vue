<template>
  <div class="registration">
    TODO: Display step {{ step }}
  </div>
</template>

<script>
  'use strict';

  export default {
    name: 'registration',
    data() {
      return {
        step: this.$route.params.step
      };
    }
  }
</script>
