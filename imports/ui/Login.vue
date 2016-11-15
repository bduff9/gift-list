<template>
  <div class="login content">
    <div class="columns is-mobile has-text-centered">
      <div class="column">
        <h1 v-text="mode === 'login' ? 'Login' : 'Register'" />
        &nbsp;&nbsp;
        <a class="is-info" href="#" @click.prevent="switchMode" v-if="$route.path !== '/logout'">
          <span>{{ mode === 'login' ? 'Register' : 'Login' }} Instead</span>
        </a>
      </div>
    </div>
    <article class="message is-success" v-if="$route.path === '/logout'">
      <div class="message-body">
        <span class="icon">
          <i class="icon ion-ios-checkmark-outline" />
        </span>
        <span>You have successfully signed out</span>
      </div>
    </article>
    <progress class="progress" v-bind:value="progress" max="100" v-if="mode === 'register'" v-text="progress + '%'" />
    <div class="column is-10 is-offset-1">
      <hr />
    </div>
    <div class="columns is-mobile has-text-centered social-login">
      <div class="column is-half-mobile">
        <button type="button" class="button is-danger" :class="{ 'is-loading': loading === 'loginWithGoogle' }" v-bind:disabled="loading === 'loginWithGoogle'" @click.prevent="oauthLogin('loginWithGoogle', $event)">
          <i class="icon ion-social-google-outline" />
          <span>{{ mode === 'login' ? 'Login' : 'Register' }} with Google</span>
        </button>
      </div>
      <div class="column is-half-mobile">
        <button type="button" class="button is-info" :class="{ 'is-loading': loading === 'loginWithFacebook' }" v-bind:disabled="loading === 'loginWithFacebook'" @click.prevent="oauthLogin('loginWithFacebook', $event)">
          <i class="icon ion-social-facebook-outline" />
          <span>{{ mode === 'login' ? 'Login' : 'Register' }} with Facebook</span>
        </button>
      </div>
    </div>
    <div class="column is-10 is-offset-">
      <hr />
    </div>
    <form ref="loginForm" @submit.prevent.stop>
      <div class="control" v-if="mode === 'register'">
        <label class="label">Full Name</label>
        <div class="control is-grouped columns is-desktop is-multiline">
          <div class="column is-half-desktop is-12-mobile">
            <p class="control has-icon is-expanded">
              <input class="input" type="text" id="first-name" name="first-name" placeholder="First Name" v-model.trim="firstName" />
              <i class="fa fa-user" />
            </p>
          </div>
          <div class="column is-half-desktop is-12-mobile">
            <p class="control has-icon is-expanded">
              <input class="input" type="text" id="last-name" name="last-name" placeholder="Last Name" v-model.trim="lastName" />
              <i class="fa fa-user" />
            </p>
          </div>
        </div>
      </div>
      <div class="control" v-if="mode === 'register'">
        <div class="columns is-mobile">
          <div class="column is-half">
            <label class="label">Date of Birth</label>
          </div>
          <div class="column is-half">
            <p class="control is-expanded" :class="{ 'is-danger': underage }">
              <span class="is-bold">Age:</span> {{ age }}
            <p>
          </div>
        </div>
        <div class="control is-grouped">
            <p class="control has-icon is-expanded">
              <input class="input" type="date" id="birthday" name="birthday" placeholder="Date of Birth" v-model.trim="birthday" />
              <i class="fa fa-calendar" />
            </p>
        </div>
      </div>
      <div class="control">
        <label class="label">Email</label>
        <p class="control has-icon">
          <input class="input" type="email" id="email" name="email" placeholder="Email Address" v-model.trim="email" />
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
      <div class="control" v-if="mode === 'register'">
        <label class="label">Confirm Password</label>
        <p class="control has-icon">
          <input class="input" type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password" v-model="confirmPassword" />
          <i class="fa fa-lock" />
        </p>
      </div>
      <div class="columns is-multiline is-mobile has-text-centered">
        <div class="column is-12-mobile">
          <button type="submit" class="button is-primary" :class="{ 'is-loading': loading === 'email' }" v-bind:disabled="loading === 'email'">
            <span>{{ mode === 'login' ? 'Login' : 'Register' }}</span>
          </button>
        </div>
        <div class="column is-12-mobile">
          <button type="button" class="button is-warning" @click.prevent="resetPassword" v-if="mode === 'login'">
            <i class="icon ion-ios-help-outline" />
            <span>Forgot Password</span>
          </button>
        </div>
      </div>

    </form>
  </div>
</template>

<script>
  'use strict';

  import { Meteor } from 'meteor/meteor';
  import { Session } from 'meteor/session';
  import { Accounts } from 'meteor/accounts-base';
  import { Bert } from 'meteor/themeteorchef:bert';

  import { MIN_AGE } from '../api/constants';
  import { displayError, getAge } from '../api/global';
  import { sendVerificationEmail } from '../api/collections/users';

  jQuery.validator.addMethod('ofAge', function(val, el) {
    const age = getAge(val);
    return this.optional(el) || (age !== 'N/A' && age >= MIN_AGE);
  });

  export default {
    name: 'login-page',
    beforeMount() {
      const family = this.$route.query.family;
      if (family) Session.set('familyToAdd', family);
    },
    data() {
      return {
        birthday: '',
        confirmPassword: '',
        email: '',
        firstName: '',
        lastName: '',
        loading: null,
        mode: (this.$route.path === '/register' ? 'register' : 'login'),
        password: '',
        validator: null
      };
    },
    computed: {
      age() {
        return getAge(this.birthday);
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
      },
      underage() {
        return this.age < MIN_AGE;
      }
    },
    methods: {
      beginValidating() {
        const that = this,
            form = this.$refs.loginForm;
        this.validator = jQuery(form).validate({
          errorClass: 'is-danger',
          submitHandler() {
            that.loading = 'email';
            that[that.mode]();
          },
          rules: {
            "first-name": {
              required: true,
              minlength: 2
            },
            "last-name": {
              required: true,
              minlength: 2
            },
            "birthday": {
              required: true,
              ofAge: true
            },
            "email": {
              required: true,
              email: true
            },
            "confirm-email": {
              required: true,
              equalTo: '#email'
            },
            "password": {
              required: true,
              minlength: 6
            },
            "confirm-password": {
              required: true,
              equalTo: '#password'
            }
          },
          messages: {
            "first-name": {
              required: 'First name is required',
              minlength: jQuery.validator.format('First name must be at least {0} characters')
            },
            "last-name": {
              required: 'Last name is required',
              minlength: jQuery.validator.format('Last name must be at least {0} characters')
            },
            "birthday": {
              required: 'Date of birth is required',
              ofAge: `You must be at least ${MIN_AGE} to sign up.  Ask your parent to add you to their account.`
            },
            "email": {
              required: 'Email is required',
              email: 'Enter a valid email address'
            },
            "confirm-email": {
              required: 'Enter your email again',
              equalTo: 'Enter the same email again'
            },
            "password": {
              required: 'Password is required',
              minlength: jQuery.validator.format('Password must be at least {0} characters')
            },
            "confirm-password": {
              required: 'Enter your desired password again',
              equalTo: 'Enter the same password again'
            }
          }
        });
      },
      login() {
        const { email, password } = this;
        Meteor.loginWithPassword(email, password, (err) => {
          if (err) {
            this.loading = null;
            if (err.reason === 'User not found') {
              displayError(err, { title: 'User not found!  Did you mean to register at the bottom of this page instead?', type: 'warning' });
            } else {
              displayError(err, { title: err.reason, type: 'warning' });
            }
          } else {
            this.redirectAfterAuth('Welcome back!');
          }
        });
      },
      oauthLogin(service, ev) {
        const options = {
          requestPermissions: ['email']
        };
        this.loading = service;
        Meteor[service](options, (err) => {
          this.loading = null;
          if (err) {
            displayError(err, { title: err.message, type: 'danger' });
          } else {
            this.redirectAfterAuth('Welcome!');
          }
        });
      },
      redirectAfterAuth(msg) {
        const redirect = Session.get('redirect') || '/';
        Bert.alert({
          message: msg,
          type: 'success',
          icon: 'fa-thumbs-up'
        });
        this.$router.replace(redirect);
      },
      register() {
        const { birthday, email, firstName, lastName, password } = this;
        let profile = { birthday, firstName, lastName };
        Accounts.createUser({ email, password, profile }, err => {
          if (err) {
            this.loading = null;
            if (err.error && err.reason) {
              displayError(err, { title: err.error, message: err.reason, type: 'warning' });
            } else {
              displayError(err);
            }
          } else {
            sendVerificationEmail.call({}, err => {
              //TODO handle this error better?
              console.error('Error on sendVerificationEmail', err);
            });
            this.redirectAfterAuth('Thanks for registering!');
          }
        });
      },
      resetPassword(ev) {
        const { email, validator } = this,
            validEmail = validator.element('#email');
        if (!email || !validEmail) {
          Bert.alert({ type: 'warning', message: 'Please enter the email you registered with' });
          return false;
        }
        Accounts.forgotPassword({ email }, err => {
          Bert.alert({ type: 'success', message: `If found, password reset email will be sent for account associated with ${email}` });
        });
      },
      switchMode(ev) {
        this.mode = (this.mode === 'login' ? 'register' : 'login');
      }
    },
    mounted() {
      this.beginValidating();
    }
  }
</script>

<style scoped lang="scss">

  div {
    .column {
      button {
        .button {
          width: 100%;
        }
      }
    }
  }
</style>
