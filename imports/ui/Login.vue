<template>
  <div class="login">
    <h1>{{ mode === 'login' ? 'Login' : 'Register' }}</h1>
    <br />
    <label class="label">Email</label>
    <p class="control">
      <input class="input" type="email" placeholder="Email Address" />
    </p>
    <label class="label">Password</label>
    <p class="control">
      <input class="input" type="password" placeholder="Password" />
    </p>
    <button class="button is-info">{{ mode === 'login' ? 'Register' : 'Login' }} Instead</button>
    <button class="button is-primary">{{ mode === 'login' ? 'Login' : 'Register' }}</button>
  </div>
</template>

<script>
  export default {
    name: 'login-page',
    data() {
      return {
        mode: 'login'
      }
    }
  }
</script>
