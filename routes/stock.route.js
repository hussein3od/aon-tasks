// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const { getAvailableStock, getSold, getAvailbalePlans, getPlanStockSummary, insertBatchStock } = require('../controllers/stockController');

router.get('/available', async (req, res) => {
  try {
    const stockData = await getAvailableStock();
    res.json(stockData);
  } catch (err) {
    console.error('GET /stock/available error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/sold', async (req, res) => {
  try {
    const stockData = await getSold();
    res.json(stockData);
  } catch (err) {
    console.error('GET /stock/sold error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/availablePlans', async (req, res) => {
  try {
    const stockData = await getAvailbalePlans(req,res);
    res.json(stockData);
  } catch (err) {
    console.error('GET /stock/available error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/PlanStockSummary', getPlanStockSummary);
router.post('/batch', insertBatchStock);

module.exports = router;
