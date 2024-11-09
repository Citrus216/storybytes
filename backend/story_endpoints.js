const express = require('express');
const { generateStoryText } = require('./stories');

const router = express.Router();

router.get('/story', (req, res) => {
  // get query parameter q. It is url encoded
  const query = req.query.q;
  if (!query) {
    return res.status(400).send('Query parameter q is required');
  }
  // Call generateStoryText function from stories.js and send as json in body {story: storyText}
  generateStoryText(query).then((storyText) => {
    res.json({ story: storyText });
  }).catch((error) => {
    console.error(error);
    res.status(500).send('An error occurred while generating the story');
  });
});

module.exports = router;