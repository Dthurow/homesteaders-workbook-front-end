

export default {
    debug: function(msg){
        console.log(msg);
        fetch("/logging?message=" + encodeURIComponent("DEBUG: " + msg), {
          });
    },
    error: function(msg){
        console.log(msg);
        fetch("/logging?message=" + encodeURIComponent("ERROR: " + msg), {
          });
    }
};
