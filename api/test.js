const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
 try {
  return res.status(200).send({ message: "test" });
 } catch (error) {
  console.error(error);
  return res.status(500).send(`Server error`);
 }
});

module.exports = router;
