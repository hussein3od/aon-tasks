const express = require("express");
const router = express.Router();
const { register, login, getBalance } = require("../controllers/clientController");

router.post("/register", async (req, res) => {
  try {
    const body = req.body;
    const isSaved = await register(body);
    if (!isSaved) {
      return res.status(501).send({ message: "اكو مشكله بالدنيا..." });
    }
    res.send({ message: "Register succefully." });
  } catch (error) {
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = req.body;
    const result = await login(body.phone, body.password);
    if (!result.success) {
      return res.status(501).send({ message: result.message });
    }
    res.send({ token: result.token });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});

// GET /client/:id/balance
router.get('/:id/balance', async (req, res) => {
  try {
    const idParam = req.params.id;

    const clientId = Number(idParam);
    if (!Number.isInteger(clientId) || clientId <= 0) {
      return res.status(400).json({ error: 'Invalid client id' });
    }

    const client = await getBalance(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    return res.json({
      id: client.id,
      name: client.name,
      balance: client.balance
    });
  } catch (err) {
    return res.status(500).json({ message: 'اكو مشكله بالدنيا....' });
  }
});

module.exports = router;
