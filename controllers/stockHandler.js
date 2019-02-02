'use strict';

const fetch = require('node-fetch');

function getPriceOf(ticker) {
    const url = `https://api.iextrading.com/1.0/stock/${ticker}/price`
    
    const stockPrice = fetch(url)
        .then(res => res.json())
        .then(json => json)
        .catch(err => {
            throw err;
        });

    return stockPrice;
}

module.exports.getPriceOf = getPriceOf;