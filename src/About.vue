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
