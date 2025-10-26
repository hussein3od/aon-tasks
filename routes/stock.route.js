// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const { getAvailableStock } = require('../controllers/stockController');

router.get('/available', async (req, res) => {
  try {
    const stockData = await getAvailableStock();
    res.json(stockData);
  } catch (err) {
    console.error('GET /stock/available error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
