const db = require('./watchlistModel');
const path = require('path');

const watchlistController = {};

watchlistController.addToList = (req, res, next) => {
  console.log(req.body);
}

watchlistController.getList = (req, res, next) => {

}

watchlistController.updateList = (req, res, next) => {

}

watchlistController.deleteFromList = (req, res, next) => {

}

module.exports = watchlistController;

