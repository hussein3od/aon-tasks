// controllers/stockController.js
const db = require('../db');

const getAvailableStock = async () => {
  const result = await db.query(`
    SELECT * FROM stock WHERE state = 'ready'
  `);
  return result.rows;
};

const getSold = async () => {
  const result = await db.query(`
    SELECT * FROM stock WHERE state = 'sold'
  `);
  return result.rows;
};

const getAvailbalePlans = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DISTINCT p.*
      FROM plan p
      JOIN stock s ON s."plan_id" = p.id
      WHERE s.state = 'ready';
    `);
    return result.rows;
  } catch (err) {
    console.error("Query error:", err.message);
    res.status(500).json({
      success: false,
      message: "there is a problem in the world",
    });
  }
};

const getPlanStockSummary = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      SELECT
        p.id AS "planId",
        p.name AS "planName",
        COUNT(CASE WHEN s.state = 'ready' THEN 1 END) AS ready,
        COUNT(CASE WHEN s.state = 'sold' THEN 1 END) AS sold,
        COUNT(CASE WHEN s.state = 'error' THEN 1 END) AS error
      FROM plan p
      LEFT JOIN stock s ON s."plan_id" = p.id
      WHERE p.id = $1
      GROUP BY p.id, p.name;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'الخطة غير موجودة' });
    }

    res.json({result: result.rows[0]});
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب ملخص الستوك' });
  }
};
const insertBatchStock = async (req, res) => {
  const { planId, codes } = req.body;

  if (!planId || !Array.isArray(codes) || codes.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'يجب تحديد planId ومصفوفة codes غير فارغة',
    });
  }

  try {
    const values = codes.map(code => `('${code}', ${planId}, 'ready', NOW())`).join(',');

    // 3️⃣ استعلام SQL لإدراج الكروت دفعة واحدة
    const query = `
      INSERT INTO stock (code, plan_id, state, created_at)
      VALUES ${values}
      RETURNING id
    `;

    const result = await db.query(query);

    res.json({
      success: true,
      inserted: result.rows.length,
    });
  } catch (err) {
    console.error('POST /stock/batch error:', err.message);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إدخال الكروت',
    });
  }
};

module.exports = {
    getAvailableStock,
    getSold,
    getAvailbalePlans,
    getPlanStockSummary,
    insertBatchStock
};
