const express = require('express');

const router = express.Router();

router.get('/dict', (req, res) => {
  const word = req.query.word;
  if (!word) {
    return res.status(400).send('Word query parameter is required');
  }
  // Add your dictionary lookup logic here
  res.send(`You searched for the word: ${word}`);
});

module.exports = router;