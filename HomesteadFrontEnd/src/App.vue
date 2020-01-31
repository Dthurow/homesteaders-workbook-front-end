<template>
 <div id="app">
  <h1>Homesteader's Workbook</h1>
  <h3>Homesteading made easy &mdash; well, easier.</h3>
  <div class="headerBar">
    <router-link to="/">Home</router-link>
    <router-link to="/plants">Plants</router-link>
    <router-link to="/gardens">Gardens</router-link>
  </div>
  <!-- route outlet -->
  <!-- component matched by the route will render here -->
  <router-view></router-view>
</div>
</template>

<script>
export default {
  name: 'app'
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
