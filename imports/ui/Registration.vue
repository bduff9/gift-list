<template>
  <div class="registration">
    <h1 v-text="'Complete Registration'" />
    <progress class="progress" v-bind:value="progress" max="100" v-text="progress + '%'" />
    <div v-if="$route.params.step === '1'">
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
        <button type="submit" class="button is-primary" :class="{ 'is-loading': loading }">
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
  import { sendVerificationEmail, updateUser } from '../api/collections/users';
  import { MIN_AGE } from '../api/constants';
  import { displayError, getAge } from '../api/global';

  export default {
    name: 'registration',
    beforeMount() {
      this.redirectToStep();
    },
    data() {
      return {
        birthday: '',
        confirmPassword: '',
        currentUser: null,
        email: '',
        families: [],
        firstName: '',
        lastName: '',
        loading: false,
        password: '',
        wasResent: false
      };
    },
    meteor: {
      subscribe: {},
      data: {
        currentUser() {
          const userId = Meteor.userId();
          if (!userId) this.$router.replace('/');
          return User.findOne(userId);
        },
        birthday() {
          return this.currentUser.birthday;
        },
        confirmPassword() {
          return this.currentUser.services.password;
        },
        email() {
          return this.currentUser.email;
        },
        families() {
          return this.currentUser.family_ids;
        },
        firstName() {
          return this.currentUser.first_name;
        },
        lastName() {
          return this.currentUser.last_name;
        },
        password() {
          return this.currentUser.services.password;
        }
      }
    },
    computed: {
      age() {
        return getAge(this.birthday);
      },
      progress() {
        let progress = 0;
        progress += (this.firstName ? 5 : 0);
        progress += (this.lastName ? 6 : 0);
        progress += (this.birthday ? 6 : 0);
        progress += (this.email ? 6 : 0);
        progress += (this.password ? 5 : 0);
        progress += (this.confirmPassword ? 5 : 0);
        progress += (this.families && this.families.length > 0 ? 33 : 0);
        progress += (this.currentUser.verified ? 33 : 0);
        return progress;
      },
      underage() {
        return this.age < MIN_AGE;
      }
    },
    methods: {
      beginValidating() {
        const that = this,
            form = this.$refs.regForm;
        jQuery(form).validate({
          errorClass: 'is-danger',
          submitHandler() {
            that.loading = true;
            that.submitStep1();
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
      redirectToStep(newStep) {
        const { currentUser } = this,
            { family_ids, services } = currentUser,
            step = this.$route.params.step,
            STEP_1 = '1',
            STEP_2 = '2',
            STEP_3 = '3';
        if (newStep) {
          if (step !== newStep) this.$router.replace(`/registration/${newStep}`);
        } else if (!services.password) {
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
      },
      submitStep1() {
        const { birthday, email, firstName, lastName, password } = this;
        let profile = { birthday, firstName, lastName };
        updateUser.call({ birthday, firstName, lastName, password }, err => {
          this.loading = false;
          if (err) {
            if (err.error && err.reason) {
              displayError(err, { title: err.error, message: err.reason, type: 'warning' });
            } else {
              displayError(err);
            }
          } else {
            this.redirectToStep();
          }
        });
      }
    },
    mounted() {
      this.beginValidating();
    },
    watch: {
      '$route'(to, from) {
        this.redirectToStep();
      }
    }
  }
</script>
