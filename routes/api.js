/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const stockHandler = require('../controllers/stockHandler.js');

module.exports = (app, db) => {

  app.route('/api/stock-prices')
    .get(async (req, res) => {
      try {
        const tickers = Array.isArray(req.query.stock) ? req.query.stock : [req.query.stock]
        const stocks = [];

        for (let ticker of tickers) {
          ticker = ticker.toUpperCase();

          const currentPrice = await stockHandler.getPriceOf(ticker);
          const dbSearchResult = await db.collection('stocks').findOne({ stock: ticker })
          
          const clientIP = req.ip;

          let likeIncrement = req.query.like ? 1 : 0;

          if (dbSearchResult 
            && dbSearchResult.ips
            && dbSearchResult.ips.includes(clientIP)
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

          const updateResult = await db.collection('stocks').findOneAndUpdate({ stock: ticker }, update, { upsert: true, returnOriginal: false });

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

        res.send('Error retrieving stock data');
      }
    });
    
};
