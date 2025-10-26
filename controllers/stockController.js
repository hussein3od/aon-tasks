// controllers/stockController.js
const db = require('../db');

const getAvailableStock = async () => {
  const result = await db.query(`
    SELECT * FROM stock WHERE state = 'ready'
  `);
  return result.rows;
};

module.exports = {
    getAvailableStock 
};
