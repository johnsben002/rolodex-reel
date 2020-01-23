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
  res.status(200).json({});
})

app.get('/getFilms',
  watchlistController.getList,
  (req, res) => {
  // console.log(res.locals.films);
  res.status(200).json(res.locals.films);
  })

/* ERROR HANDLER */
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


app.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
})