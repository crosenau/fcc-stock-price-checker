/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require(`chai-http`);
var chai = require(`chai`);
var assert = chai.assert;
var server = require(`../server`);

chai.use(chaiHttp);

suite(`Functional Tests`, () => {
    
    suite(`GET /api/stock-prices => stockData object`, () => {
      
      test(`1 stock`, (done) => {
       chai.request(server)
        .get(`/api/stock-prices`)
        .query({ stock: `goog` })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.exists(res.body.stockData, `Response body should include attribute "stockData"`);
          assert.isObject(res.body.stockData, `stockData should be an object`);
          assert.exists(res.body.stockData.stock, `stockData should contain a "stock" attribute`);
          assert.exists(res.body.stockData.price, `stockData should contain a "price" attribute`);
          assert.exists(res.body.stockData.likes, `stockData should contain a "likes" attribute`);
          assert.isString(res.body.stockData.stock, `stockData.stock should be a string`);
          assert.equal(res.body.stockData.stock, `GOOG`, `stockData.stock should equal "GOOG"`);
          assert.isString(res.body.stockData.price, `stockData.price should be a string`);
          assert.isNumber(res.body.stockData.likes, `stockData.likes should be a number`);
          assert.notExists(res.body.stockData.ips, `stockData should not include "ips" attribute`);
          done();
        });
      });
      
      test(`1 stock with like`, (done) => {
        chai.request(server)
          .get(`/api/stock-prices`)
          .query({ stock: `goog`, like: `true` })
          .end((err, res) => {             
            assert.equal(res.status, 200);
            assert.exists(res.body.stockData, `Response body should include attribute "stockData"`);
            assert.isObject(res.body.stockData, `stockData should be an object`);
            assert.exists(res.body.stockData.stock, `stockData should contain a "stock" attribute`);
            assert.exists(res.body.stockData.price, `stockData should contain a "price" attribute`);
            assert.exists(res.body.stockData.likes, `stockData should contain a "likes" attribute`);
            assert.isString(res.body.stockData.stock, `stockData.stock should be a string`);
            assert.equal(res.body.stockData.stock, `GOOG`, `stockData.stock should equal "GOOG"`);
            assert.isString(res.body.stockData.price, `stockData.price should be a string`);
            assert.isNumber(res.body.stockData.likes, `stockData.likes should be a number`);
            assert.equal(res.body.stockData.likes, 1, `stockData.likes should now equal 1`)
            assert.notExists(res.body.stockData.ips, `stockData should not include "ips" attribute`);
            done();
          });
      });
      
      test(`1 stock with like again (ensure likes arent double counted)`, (done) => {
        chai.request(server)
          .get(`/api/stock-prices`)
          .query({ stock: `goog`, like: `true` })
          .end((err, res) => {             
            assert.equal(res.status, 200);
            assert.exists(res.body.stockData, `Response body should include attribute "stockData"`);
            assert.isObject(res.body.stockData, `stockData should be an object`);
            assert.exists(res.body.stockData.stock, `stockData should contain a "stock" attribute`);
            assert.exists(res.body.stockData.price, `stockData should contain a "price" attribute`);
            assert.exists(res.body.stockData.likes, `stockData should contain a "likes" attribute`);
            assert.isString(res.body.stockData.stock, `stockData.stock should be a string`);
            assert.equal(res.body.stockData.stock, `GOOG`, `stockData.stock should equal "GOOG"`);
            assert.isString(res.body.stockData.price, `stockData.price should be a string`);
            assert.isNumber(res.body.stockData.likes, `stockData.likes should be a number`);
            assert.equal(res.body.stockData.likes, 1, `stockData.likes should still equal 1`);
            assert.notExists(res.body.stockData.ips, `stockData should not include "ips" attribute`);
            done();
          });
      });
      
      test(`2 stocks`, (done) => {
        const query = { stock: [`aapl`, `msft`] };

        chai.request(server)
          .get(`/api/stock-prices`)
          .query(query)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.exists(res.body.stockData, `Response body should include attribute "stockData"`);
            assert.isArray(res.body.stockData, `stockData should be an Array`);

            for (let x = 0; x < res.body.stockData.length; x++) {
              assert.exists(res.body.stockData[x].stock, `stockData[${x}] should contain a "stock" attribute`);
              assert.exists(res.body.stockData[x].price, `stockData[${x}] should contain a "price" attribute`);
              assert.exists(res.body.stockData[x].rel_likes, `stockData[${x}] should contain a "rel_likes" attribute`);
              assert.isString(res.body.stockData[x].stock, `stockData[${x}].stock should be a string`);
              assert.equal(res.body.stockData[x].stock, query.stock[x].toUpperCase(), `stockData[${x}].stock should equal "${query.stock[x].toUpperCase()}"`);
              assert.isString(res.body.stockData[x].price, `stockData[${x}].price should be a string`);
              assert.isNumber(res.body.stockData[x].rel_likes, `stockData[${x}].rel_likes should be a number`);
              assert.notExists(res.body.stockData[x].ips, `stockData[${x}] should not include "ips" attribute`);
            }
            done();
          });
      });
      
      test(`2 stocks with like`, (done) => {
        const query = { stock: [`aapl`, `msft`], like: true };

        chai.request(server)
          .get(`/api/stock-prices`)
          .query(query)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.exists(res.body.stockData, `Response body should include attribute "stockData"`);
            assert.isArray(res.body.stockData, `stockData should be an Array`);

            for (let x = 0; x < res.body.stockData.length; x++) {
              assert.exists(res.body.stockData[x].stock, `stockData[${x}] should contain a "stock" attribute`);
              assert.exists(res.body.stockData[x].price, `stockData[${x}] should contain a "price" attribute`);
              assert.exists(res.body.stockData[x].rel_likes, `stockData[${x}] should contain a "rel_likes" attribute`);
              assert.isString(res.body.stockData[x].stock, `stockData[${x}].stock should be a string`);
              assert.equal(res.body.stockData[x].stock, query.stock[x].toUpperCase(), `stockData[${x}].stock should equal "${query.stock[x].toUpperCase()}"`);
              assert.isString(res.body.stockData[x].price, `stockData[${x}].price should be a string`);
              assert.isNumber(res.body.stockData[x].rel_likes, `stockData[${x}].rel_likes should be a number`);
              assert.equal(res.body.stockData[x].rel_likes, 0, `stockData[${x}].rel_likes should equal 0`);
              assert.notExists(res.body.stockData[x].ips, `stockData[${x}] should not include "ips" attribute`);
            }
            done();
          });
      });
    });
});
