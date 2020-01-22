const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;

const app = express();

const watchlistController = require('./watchlistController');


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use('/build', express.static(path.resolve(__dirname, 'build')));

/**
 * FLOW TEST
 */
app.use((req, res, next) => {
  console.log(`********* FLOW TEST *********
  METHOD: ${req.method},
  URL: ${req.url},
  BODY: ${JSON.stringify(req.body, null, 2)}\n`);

  return next();
})

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'));
})


app.post('/films',
  watchlistController.addToList,
  (req, res) => {
  //add film to databse
})


app.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
})