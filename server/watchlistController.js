const db = require('./watchlistModel');
const path = require('path');

const watchlistController = {};

watchlistController.addToList = (req, res, next) => {
  console.log(req.body);
  const r = req.body;
  const newFilm = {
    text: `INSERT INTO watchlist (title, director, imdbRating, imgUrl, plot) VALUES ($1, $2, $3, $4, $5)`,
    values: [r.title, r.director, r.imdbRating, r.imgUrl, r.plot]
  }
  db
    .query(newFilm)
    .then(next())
    .catch(err => {
      return next({
              log: 'Express error handler caught addToList middleware error',
              status: 400,
              message: { err: err.message },
            });
    })
}

watchlistController.getList = (req, res, next) => {
  const filmQuery = 'SELECT * FROM watchlist'
  db 
    .query(filmQuery)
    .then(data => {
      res.locals.films = data.rows;
    })
    .then(next)
    .catch(err => {
      return next({
              log: 'Express error handler caught getList middleware error',
              status: 400,
              message: { err: err.message },
            });
    })
}

watchlistController.updateList = (req, res, next) => {

}

watchlistController.deleteFromList = (req, res, next) => {

}

module.exports = watchlistController;

