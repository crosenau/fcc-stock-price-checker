/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const fetch = require('node-fetch');
const MongoClient = require('mongodb');

module.exports = (app, db) => {

  app.route('/api/stock-prices')
    .get(async (req, res) => {
      // iex trading API: https://api.iextrading.com/1.0/stock/aapl/price
      try {
        console.log(req.query);
        const clientIP = req.ip;
        const tickers = ((req.query.stock instanceof Array) ? req.query.stock : [req.query.stock])
          .map(str => str.toUpperCase());
        
        console.log('tickers" ', tickers);
        
        let stocks = [];

        for (let ticker of tickers) {
          const url = `https://api.iextrading.com/1.0/stock/${ticker}/price`
          console.log('url: ', url);
          const response = await fetch(url);
          const currentPrice = await response.json();

          const queryResult = await db.collection('stocks').findOne({ stock: ticker })
          console.log('queryResult: ', queryResult);

          let likeIncrement = req.query.like ? 1 : 0;

          if (queryResult 
            && queryResult.ips
            && queryResult.ips.includes(clientIP)
          ) {
              likeIncrement = 0;
          }

          const update = {
            $set: { stock: ticker },
            $set: { price: currentPrice },
            $inc: { likes: likeIncrement }
          }

          if (likeIncrement > 0) {
            update.$addToSet = { ips: clientIP }
          }

          console.log('update: ', update);

          const updateResult = await db.collection('stocks').findOneAndUpdate({ stock: ticker }, update, { upsert: true, returnOriginal: false });

          console.log('updateResults: ', updateResult.value);

          stocks.push(updateResult.value);
        }

        if (stocks.length === 1) {
          res.json({
            stockData: {
              stock: stocks[0].stock,
              price: stocks[0].price,
              likes: stocks[0].likes
            }
          })
        } else if (stocks.length > 1) {
          const stockData = [];

          for (let x = 0; x < stocks.length; x++) {
            stockData.push({
              stock: stocks[x].stock,
              price: stocks[x].price,
              rel_likes: stocks[x].likes - stocks[stocks.length - 1 - x].likes
            });
          }

          res.json({ stockData });
        }

      } 
      catch(err) {
        console.error(err);

        if (err.type === 'invalid-json') {
          return res.send('Unknown Symbol');
        }
      }
    });
    
};
