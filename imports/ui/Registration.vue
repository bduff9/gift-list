<template>
  <div class="registration">
    <div v-if="$route.params.step === '1'">
      <h1 v-text="'Complete Registration'" />
      <progress class="progress" v-bind:value="progress" max="100" v-text="progress + '%'" />
      <form ref="regForm" @submit.prevent.stop>
        <div class="control">
          <label class="label">Full Name</label>
          <div class="control is-grouped">
            <p class="control has-icon is-expanded">
              <input class="input" type="text" id="first-name" name="first-name" placeholder="First Name" v-model.trim="firstName" />
              <i class="fa fa-user" />
            </p>
            <p class="control has-icon is-expanded">
              <input class="input" type="text" id="last-name" name="last-name" placeholder="Last Name" v-model.trim="lastName" />
              <i class="fa fa-user" />
            </p>
          </div>
        </div>
        <div class="control">
          <label class="label">Date of Birth</label>
          <div class="control is-grouped">
            <p class="control has-icon is-expanded">
              <input class="input" type="date" id="birthday" name="birthday" placeholder="Date of Birth" v-model.trim="birthday" />
              <i class="fa fa-calendar" />
            </p>
            <p class="control is-expanded" :class="{ 'is-danger': underage }">
              <span class="is-bold">Age:</span> {{ age }}
            </p>
          </div>
        </div>
        <div class="control">
          <label class="label">Email</label>
          <p class="control has-icon">
            <input class="input" type="email" id="email" name="email" placeholder="Email Address" v-model.trim="email" readonly />
            <i class="fa fa-envelope" />
          </p>
        </div>
        <div class="control">
          <label class="label">Password</label>
          <p class="control has-icon">
            <input class="input" type="password" id="password" name="password" placeholder="Password" v-model="password" />
            <i class="fa fa-lock" />
          </p>
        </div>
        <div class="control">
          <label class="label">Confirm Password</label>
          <p class="control has-icon">
            <input class="input" type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password" v-model="confirmPassword" />
            <i class="fa fa-lock" />
          </p>
        </div>
        <button type="submit" class="button is-primary" :class="{ 'is-loading': loading === 'email' }" v-bind:disabled="loading === 'email'">
          <span>Next Step</span>
          <span class="icon">
            <i class="icon ion-arrow-right-a" />
          </span>
        </button>
      </form>
    </div>
    <div v-if="$route.params.step === '2'">Step 2 - Family(s)</div>
    <div v-if="$route.params.step === '3'">
      <h1>Please verify your email to finish registration</h1>
      <button type="button" class="button is-primary" :class="{ 'is-loading': wasResent }" :disabled="wasResent" @click.prevent="resendEmail">
        <i class="icon ion-email" />
        Resend verification email
      </button>
    </div>
  </div>
</template>

<script>
  'use strict';

  import { Meteor } from 'meteor/meteor';

  import { User } from '../api/schema';
  import { sendVerificationEmail } from '../api/collections/users';

  export default {
    name: 'registration',
    beforeMount() {
      this.redirectToStep();
    },
    data() {
      return {
        wasResent: false
      };
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
        const { currentUser } = this,
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
          //TODO set done_registering to true
          this.$router.replace('/');
        }
      },
      resendEmail(ev) {
        this.wasResent = true;
        sendVerificationEmail.call({}, displayError);
      }
    },
    watch: {
      '$route'(to, from) {
        this.redirectToStep();
      }
    }
  }
</script>
