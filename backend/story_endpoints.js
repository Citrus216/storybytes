const express = require('express');

const router = express.Router();

router.get('/story', (req, res) => {
  // get query parameter q. It is url encoded
  const query = req.query.q;
  if (!query) {
    return res.status(400).send('Query parameter q is required');
  }
  res.status(200).send(`You searched for the story: ${query}`);
});

module.exports = router;