const db = require('../db');

const getClientInvoices = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      SELECT *
      FROM invoice
      WHERE client_id = ${id}
      ORDER BY created_at DESC
      LIMIT 50
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'لا توجد فواتير لهذا العميل',
      });
    }

    res.json({
      success: true,
      clientId: id,
      invoices: result.rows,
    });
  } catch (err) {
    console.error('GET /invoice/client/:id error:', err.message);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الفواتير',
    });
  }
};

module.exports = { getClientInvoices };
