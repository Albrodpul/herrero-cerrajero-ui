const express = require('express');
const app = express();
const path = require('path');

app.use('/', express.static(__dirname +  '/public'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

var port = (process.env.PORT || 8800);

app.listen(port, () => {
  console.log("Magic happens on port: " + port);
});
