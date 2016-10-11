<template>
  <div class="login content">
    <h1>{{ mode === 'login' ? 'Login' : 'Register' }}</h1>
    <label class="label" v-if="mode === 'register'">First Name</label>
    <p class="control has-icon" v-if="mode === 'register'">
      <input class="input" type="text" placeholder="First Name" v-model.trim="firstName" />
      <i class="fa fa-user" />
    </p>
    <label class="label">Email</label>
    <p class="control has-icon">
      <input class="input" type="email" placeholder="Email Address" v-model.trim="email" />
      <i class="fa fa-envelope" />
    </p>
    <label class="label">Password</label>
    <p class="control has-icon">
      <input class="input" type="password" placeholder="Password" v-model="password" />
      <i class="fa fa-lock" />
    </p>
    <span v-if="mode === 'register'">
      <label class="label">Confirm Password</label>
      <p class="control has-icon">
        <input class="input" type="password" placeholder="Confirm Password" v-model="confirmPassword" />
        <i class="fa fa-lock" />
      </p>
      <span />
    </span>
    <button class="button is-info" @click="switchMode">{{ mode === 'login' ? 'Register' : 'Login' }} Instead</button>
    <button class="button is-primary" @click="submitForm">{{ mode === 'login' ? 'Login' : 'Register' }}</button>
  </div>
</template>

<script>
  export default {
    name: 'login-page',
    data() {
      return {
        confirmPassword: '',
        email: '',
        mode: 'login',
        password: ''
      };
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
