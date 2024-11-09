const express = require('express');

const router = express.Router();

const stories = [
  { id: 1, title: 'Story 1', content: 'This is the content of story 1' },
  { id: 2, title: 'Story 2', content: 'This is the content of story 2' },
  // Add more stories as needed
];

router.get('/story', (req, res) => {
  res.json(stories);
});

module.exports = router;