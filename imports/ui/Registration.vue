<template>
  <div class="registration">
    <div v-if="$route.params.step === '1'">Step 1 - Email and password</div>
    <div v-if="$route.params.step === '2'">Step 2 - Family(s)</div>
    <div v-if="$route.params.step === '3'">Step 3 - Verify email</div>
  </div>
</template>

<script>
  'use strict';

  export default {
    name: 'registration',
    data() {
      return {};
    }
  }
</script>
