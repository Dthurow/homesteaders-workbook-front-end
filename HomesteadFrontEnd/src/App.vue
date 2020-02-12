<template>
 <div id="app">
  <h1>Homesteader's Workbook</h1>
  <h3>Homesteading made easy &mdash; well, easier.</h3>
  <div class="headerBar">
    <div style="flex:1 1 auto;"> 
      <router-link to="/">Home</router-link>
      <router-link to="/plants">Plants</router-link>
      <router-link to="/gardens">Gardens</router-link>
    </div>
  <div class="loggedInInfo" v-show="isLoggedIn()">
     <div class="userInfo" v-if="userInfo != null">
       <div class="userPic">
        <img v-if="userInfo.picture != null" v-bind:src="userInfo.picture">
       </div>
      {{userInfo.name}}
    </div>
    <div>
        <button class="logoutbutton" @click="handleLogout()">Log out </button>
    </div>
  </div>


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
import { isLoggedIn, login, logout, getUserData } from './js/auth';
export default {
  name: 'app',
  data() {
    return{
      userInfo: null
    }
  },
  created: function (){
    if (isLoggedIn() && this.userInfo == null){
      this.getUserData();
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
    getUserData(){
      return getUserData(this.setUserInfo);
    },
    setUserInfo(error, user){
      this.userInfo = user;
    }
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
