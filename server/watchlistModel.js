const { Pool } = require('pg');

const PG_URI = 'postgres://pecfxtpv:70so-zMcldugkHoo0FgNMk5_aQpeeoi0@rajje.db.elephantsql.com:5432/pecfxtpv';

const pool = new Pool({
  connectionString: PG_URI
});

/*
watchlist TABLE SCHEMA(
film_id       VARCHAR
title         VARCHAR
director      VARCHAR
imdbRating    VARCHAR
imgUrl        VARCHAR
watched       VARCHAR
plot          VARCHAR
)
*/

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  }
};