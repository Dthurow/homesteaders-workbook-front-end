<template>
  <div id="about">
    <div>
      <h2>
        Why the Workbook?
      </h2>
      <p>
        Homesteading is all about self-sufficiency.
        Growing gardens to feed your family, raising animals to butcher, and foraging for local wild edibles.
        When everything goes right, you’re free from buying things at the local box store, able to do what you love and care for yourself and those closest to you.
        However, nature rarely lets everything go right.
        Pests, late frosts and more can decimate a harvest, affect your planned yield, and tie you right back to that box store.
      </p>
      <p>
        And even if everything goes perfectly, you still have to plan everything out.
        How many tomatoes should you grow for a family of four?
        Which variety will yield the most and tastiest?
        The internet can be a big help, but at the end of the day your homestead is YOUR homestead.
        It’s in a unique place with unique challenges, and relying on the yield amounts listed on seed packets can result in less than ideal harvests.
      </p>
      <p>
        The homesteader’s workbook is designed to support a small homestead, letting you collect info about YOUR homestead in one place,
        so you can plan your gardens based on data from your home, not the internet.
      </p>
      
      
    </div>
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
    <div v-if="!IsLoggedIn()" class="specialAlert">
      <b>Want to explore this site?</b>
      You must log in to be able to edit and create your own garden/plants/etc.
      You don't have to create a new account, you can login with an existing Google account.
      <br />
      <button @click="handleLogin()">Log In</button>
    </div>
    
  </div>
</template>

<script>
import { isLoggedIn } from "./js/auth";

export default {
  name: "about",
  methods: {
    IsLoggedIn: function() {
      return isLoggedIn();
    }
  }
};
</script>

<style>
</style>
