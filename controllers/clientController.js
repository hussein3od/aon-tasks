const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (body) => {
  const phone = body.phone;
  const password = body.password;
  const name = body.name;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.query(`INSERT INTO Client (name, phone, password)
                VALUES
                ('${name}', '${phone}', '${hashedPassword}');`);

  if (result.rowCount === 1) {
    return true;
  } else {
    return false;
  }
};

const login = async (phone, password) => {
  const result = await db.query(`select * from client where phone = '${phone}'`);
  if (result.rowCount !== 1) {
    return { success: false, message: "user not found!" };
  }

  const user = result.rows[0];
  const hashedPassword = user.password;
  const isPassValid = await bcrypt.compare(password, hashedPassword);
  if (!isPassValid) {
    return { success: false, message: "لاتصير لوتي" };
  }

  const token = jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      name: user.name,
    },
    process.env.SECRET_KEY
  );
  
  return { success: true, token: token };
};

const getBalance = async (clientId) => {
  const result = await db.query(
    `SELECT id, name, balance FROM client WHERE id = ${clientId}`
  );
  if (result.rowCount !== 1) {
    return null;
  }
  return result.rows[0];
};
const topUpClient = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'المبلغ غير صالح',
    });
  }

  try {
    const clientRes = await db.query(`SELECT balance FROM client WHERE id = ${id}`);

    if (clientRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'العميل غير موجود',
      });
    }

    const oldBalance = parseFloat(clientRes.rows[0].balance);
    const newBalance = oldBalance + parseFloat(amount);

    await db.query(
      `UPDATE client SET balance = ${newBalance} WHERE id = ${id}`
    );

    res.json({
      success: true,
      id,
      oldBalance,
      newBalance,
    });
  } catch (err) {
    console.error('POST /client/:id/topup error:', err.message);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إيداع الرصيد',
    });
  }
};

module.exports = {
  register,
  login,
  getBalance,
  topUpClient,
};
