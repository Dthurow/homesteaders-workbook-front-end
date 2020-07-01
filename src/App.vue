<template>
  <div id="app">
    <h1>Homesteader's Workbook</h1>
    <h3>Homesteading made easy &mdash; well, easier.</h3>
    <div class="headerBar">
      <div style="flex:1 1 auto;">
        <router-link to="/">Home</router-link>
        <router-link v-if="isLoggedIn()" :to="{ name: 'seedchest'}">Seed Chest</router-link>
        <router-link v-if="isLoggedIn()" :to="{ name: 'gardens'}">Your Gardens</router-link>
        <router-link v-if="isLoggedIn()" :to="{ name: 'plantgroups'}">Plant Groups</router-link>
        <router-link to="/about">About</router-link>
      </div>
      <div class="loggedInInfo" v-if="isLoggedIn()">
        <div class="userInfo" v-if="userInfo != null">
          <div class="userPic">
            <img v-if="userInfo.picture != null" v-bind:src="userInfo.picture" />
          </div>
          {{userInfo.name}}
        </div>
        <div>
          <button class="logoutbutton" @click="handleLogout()">Log out</button>
        </div>
      </div>
      <div v-else>
        <button @click="handleLogin()">Log In</button>
      </div>
    </div>
    <p>
      <b>NOTE:</b> The homesteader's workbook is currently in
      <b>ALPHA</b>.
      This means a lot of the functionality is only partially implemented, or not implemented at all!
      Feel free to poke around, but remember, all design and functionality is still subject to change!
    </p>
    <div class="specialAlert" v-if="isLoggedIn() && displayIntro">
      <b>New to the Homesteader's Workbook?</b> Go through the <router-link v-bind:to="{name: 'intro'}">Intro</router-link> to learn more about what it can do!
    </div>
    <hr />
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { isLoggedIn, login, logout, getUserData } from "./js/auth";
export default {
  name: "app",
  data() {
    return {
      userInfo: null
    };
  },
  created: function() {
    if (isLoggedIn() && this.userInfo == null) {
      this.getUserData();
    }
  },
  computed: {
    displayIntro: function() {
      return (
        true
      );
    }
  },
  methods: {
    handleLogin() {
      login();
      console.log("after login");
    },
    handleLogout() {
      logout();
    },
    isLoggedIn() {
      return isLoggedIn();
    },
    getUserData() {
      let user = getUserData();
      this.userInfo = user;
    }
  }
};
</script>

<style>
h3 {
  margin-top: 0px;
}
h1 {
  margin-bottom: 0px;
  color: #279935;
}
</style>
