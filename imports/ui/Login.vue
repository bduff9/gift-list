<template>
  <div class="login content">
    <h1 v-text="mode === 'login' ? 'Login' : 'Register'" />
    <article class="message is-success" v-if="route.path === '/logout'">
      <div class="message-body">
        <i class="icon ion-ios-checkmark-outline" />
        <span>You have successfully signed out</span>
      </div>
    </article>
    <progress class="progress" v-bind:value="progress" max="100" v-if="mode === 'register'" v-text="progress + '%'" />
    <div class="control" v-if="mode === 'register'">
      <label class="label">Full Name</label>
      <div class="control is-grouped">
        <p class="control has-icon is-expanded">
          <input class="input" type="text" placeholder="First Name" v-model.trim="firstName" />
          <i class="fa fa-user" />
        </p>
        <p class="control has-icon is-expanded">
          <input class="input" type="text" placeholder="Last Name" v-model.trim="lastName" />
          <i class="fa fa-user" />
        </p>
      </div>
    </div>
    <div class="control" v-if="mode === 'register'">
      <label class="label">Date of Birth</label>
      <div class="control is-grouped">
        <p class="control has-icon is-expanded">
          <input class="input" type="date" placeholder="Date of Birth" v-model.trim="birthday" />
          <i class="fa fa-calendar" />
        </p>
        <p class="control is-expanded" :class="{ 'underage': age < 13 }">
          <span class="is-bold">Age:</span> {{ age }}
        </p>
      </div>
    </div>
    <div class="control">
      <label class="label">Email</label>
      <p class="control has-icon">
        <input class="input" type="email" placeholder="Email Address" v-model.trim="email" />
        <i class="fa fa-envelope" />
      </p>
    </div>
    <div class="control">
      <label class="label">Password</label>
      <p class="control has-icon">
        <input class="input" type="password" placeholder="Password" v-model="password" />
        <i class="fa fa-lock" />
      </p>
    </div>
    <div class="control" v-if="mode === 'register'">
      <label class="label">Confirm Password</label>
      <p class="control has-icon">
        <input class="input" type="password" placeholder="Confirm Password" v-model="confirmPassword" />
        <i class="fa fa-lock" />
      </p>
    </div>
    <button class="button is-info" @click="switchMode" v-if="route.path !== '/logout'">
      <span>{{ mode === 'login' ? 'Register' : 'Login' }} Instead</span>
    </button>
    <button class="button is-primary" @click="submitForm">
      <span>{{ mode === 'login' ? 'Login' : 'Register' }}</span>
    </button>
    <button class="button is-warning" @click="" v-if="mode === 'login'">
      <i class="icon ion-ios-help-outline" />
      <span>Forgot Password</span>
    </button>
    <button class="button is-danger" @click="">
      <i class="icon ion-social-google-outline" />
      <span>{{ mode === 'login' ? 'Login' : 'Register' }} with Google</span>
    </button>
    <button class="button is-info" @click="">
      <i class="icon ion-social-facebook-outline" />
      <span>{{ mode === 'login' ? 'Login' : 'Register' }} with Facebook</span>
    </button>
  </div>
</template>

<script>
  'use strict';

  import { moment } from 'meteor/momentjs:moment';

  export default {
    name: 'login-page',
    data() {
      const route = this.$route;
      return {
        birthday: '',
        confirmPassword: '',
        email: '',
        family: route.query.family,
        firstName: '',
        lastName: '',
        mode: (route.path === '/register' ? 'register' : 'login'),
        password: ''
      };
    },
    computed: {
      age() {
        const INVALID = 'N/A',
            TODAY = moment();
        let bday, age;
        if (this.birthday) {
          bday = moment(this.birthday);
          if (bday.isValid()) return TODAY.diff(bday, 'years');
        }
        return INVALID;
      },
      route() {
        return this.$route;
      },
      progress() {
        let progress = 0;
        progress += (this.firstName ? 5 : 0);
        progress += (this.lastName ? 5 : 0);
        progress += (this.birthday ? 5 : 0);
        progress += (this.email ? 5 : 0);
        progress += (this.password ? 5 : 0);
        progress += (this.confirmPassword ? 5 : 0);
        return progress;
      }
    },
    methods: {
      login() {
        const { email, password } = this;
        alert(`TODO login ${email} with pass ${password}`);
      },
      register() {
        const { email, password } = this;
        alert(`TODO register ${email} with pass ${password}`);
      },
      submitForm(ev) {
        ev.preventDefault();
        this[this.mode]();
        return false;
      },
      switchMode(ev) {
        this.mode = (this.mode === 'login' ? 'register' : 'login');
      }
    }
  }
</script>

<style scoped lang="scss">
  .underage {
    color: #ff3860;
  }

  .is-bold {
    font-weight: 700;
  }
</style>
