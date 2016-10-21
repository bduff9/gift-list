<template>
  <div class="registration">
    <div v-if="$route.params.step === '1'">Step 1 - Email and password</div>
    <div v-if="$route.params.step === '2'">Step 2 - Family(s)</div>
    <div v-if="$route.params.step === '3'">Step 3 - Verify email</div>
  </div>
</template>

<script>
  'use strict';

  import { User } from '../api/schema';

  export default {
    name: 'registration',
    beforeMount() {
      this.redirectToStep();
    },
    data() {
      return {};
    },
    meteor: {
      subscribe: {},
      data: {
        currentUser() {
          return User.findOne(Meteor.userId());
        }
      }
    },
    methods: {
      redirectToStep() {
        const currentUser = User.findOne(Meteor.userId()),
            { family_ids, services } = currentUser,
            step = this.$route.params.step,
            STEP_1 = '1',
            STEP_2 = '2',
            STEP_3 = '3';
        if (!services.password) {
          if (step !== STEP_1) this.$router.replace(`/registration/${STEP_1}`);
        } else if (!family_ids || family_ids.length === 0) {
          if (step !== STEP_2) this.$router.replace(`/registration/${STEP_2}`);
        } else if (!verified) {
          if (step !== STEP_3) this.$router.replace(`/registration/${STEP_3}`);
        } else { // Registration has been completed
          this.$router.replace('/');
        }
      }
    },
    watch: {
      '$route'(to, from) {
        this.redirectToStep();
      }
    }
  }
</script>
