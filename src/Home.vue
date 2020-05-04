<template>
  <div id="home">
    <div v-if="!IsLoggedIn()">
      <h2>How the Homesteader's Workbook can help you:</h2>
      <b>Before you start your garden(s)</b>
      <ul>
        <li>Track what seeds/seedlings you currently have so you don’t buy what you don’t need</li>
        <li>Look back on previous years to see which varieties had the best yield and worked best for your homestead</li>
        <li>Figure out how much to plant to provide as much as possible for your family</li>
      </ul>
      <b>During the growing season</b>
      <ul>
        <li>Track what you still need to do so you can keep on top of your work</li>
        <li>Track big storms, pests, and other issues as they come, so you can know the issues that affect YOUR homestead the most (have a huge issue with rabbits? Get late frosts a lot? Track that so you know for next year!)</li>
        <li>Track how much you planted and how much you harvested, to see if you’re on track for your harvests or not</li>
      </ul>
      <b>At the end of the growing season</b>
      <ul>
        <li>Find out what the actual yields were, and update varieties with more accurate estimated yields, to better understand what works for YOUR homestead</li>
        <li>Use your notes to better figure out what fixes and upgrades you need for your homestead.</li>
      </ul>
    </div>
    <div v-if="!IsLoggedIn()" class="specialAlert">
      <b>Want to explore this site?</b>
      You must log in to be able to edit and create your own garden/plants/etc.
      You don't have to create a new account, you can login with an existing Google account.
      <br />
      <button @click="handleLogin()">Log In</button>
    </div>
    <garden-rollup v-if="IsLoggedIn()"></garden-rollup>
    
  </div>
</template>

<script>
import gardenRollupComponent from "./components/Home/GardenRollupComponent";
import { isLoggedIn, login } from "./js/auth";

export default {
  name: "home",
  components: {
    "garden-rollup": gardenRollupComponent
  },
  methods: {
     handleLogin() {
      login();
      console.log("after login");
    },
    IsLoggedIn: function() {
      return isLoggedIn();
    }
  }
};
</script>

<style>
</style>
