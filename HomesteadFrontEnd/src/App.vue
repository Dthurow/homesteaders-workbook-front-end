<template>
 <div id="app">
  <h1>Homesteader's Workbook</h1>
  <h3>Homesteading made easy &mdash; well, easier.</h3>
  <div class="headerBar">
    <router-link to="/">Home</router-link>
    <router-link to="/plants">Plants</router-link>
    <router-link to="/gardens">Gardens</router-link>
    <button class="logoutbutton" v-show="isLoggedIn()" @click="handleLogout()">Log out </button>
  </div>
  <div v-show="!isLoggedIn()" class="specialAlert">
    <b>Want to explore this site?</b>
    You must log in to be able to edit and create your own garden/plants/etc. 
    You don't have to create a new account, you can login with an existing Google account.
    <br/>
      <button @click="handleLogin()">Log In</button>
  </div>
  


  <!-- route outlet -->
  <!-- component matched by the route will render here -->
  <router-view></router-view>
</div>
</template>

<script>
import { isLoggedIn, login, logout } from './js/auth';
export default {
  name: 'app',
   methods: {
    handleLogin() {
      login();
    },
    handleLogout() {
      logout();
    },
    isLoggedIn() {
      return isLoggedIn();
    },
  }
}
</script>

<style>
h3{
  margin-top:0px;
}
h1{
  margin-bottom: 0px;
  color: #279935;
}
</style>
