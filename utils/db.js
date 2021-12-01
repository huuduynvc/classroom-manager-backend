const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: 'en1ehf30yom7txe7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'vwlrdwxmrnwcrmld',
    password: 'vo3129b8d3t4zqq1',
    database: 'h89rdtkwprv773sl',
    port: 3306
  },
  pool: {
    min: 0,
    max: 50
  }
});

// const knex = require('knex')({
//   client: 'mysql2',
//   connection: {
//     host: '127.0.0.1',
//     user: 'root',
//     password: '',
//     database: 'classroom_manager',
//     port: 3306
//   },
//   pool: {
//     min: 0,
//     max: 50
//   }
// });

module.exports = knex;
