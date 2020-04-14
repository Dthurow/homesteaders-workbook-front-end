<template>
</template>
<script>
import { setIdToken, setAccessToken } from './js/auth';
export default {
  name: 'callback',
  mounted() {
    this.$nextTick(() => {
        console.log('hi');
      setAccessToken();
      setIdToken();
      window.location.href = '/';
    });
  },
};
</script>