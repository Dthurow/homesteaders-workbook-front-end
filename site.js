 // set up ========================
 var express  = require('express');
 var app      = express();                               // create our app w/ express
 

 // configuration =================

 
 app.use('/static', express.static('static'));
 app.use('/dist', express.static('dist'));

 // application -------------------------------------------------------------
 app.get('*', function(req, res) {
  res.sendFile(__dirname + '/index.html'); // load the single view file (vueJS will handle the page changes on the front-end)
});


 // listen (start app with node server.js) ======================================
 const PORT = process.env.PORT || 5000;
 app.listen(PORT);
 console.log("process env is: " + process.env.PORT);
 console.log("App listening on port " + PORT);