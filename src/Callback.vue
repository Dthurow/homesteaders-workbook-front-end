<template>
</template>
<script>
import { setIdToken, setAccessToken, getUserData, getAccessToken } from './js/auth';
import { config } from "./js/config";

export default {
  name: 'callback',
  mounted() {
    this.$nextTick(() => {
      setAccessToken();
      setIdToken();
      //get user info and tell the API about a successful login:
      var user = getUserData();
      console.log(user);
      fetch(config.apiURL + "/api/persons/loggedin?name=" + encodeURIComponent(user.name), {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      }).then(response => window.location.href='/')
        .catch(error =>
          console.error("Unable finish login", error)
        );

    });
  },
};
</script>