/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');

module.exports = (app, db) => {

  app.route('/api/stock-prices')
    .get((req, res) => {
      // iex trading API: https://api.iextrading.com/1.0/stock/aapl/price
      console.log(req.query);
    });
    
};
