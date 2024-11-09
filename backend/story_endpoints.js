const express = require('express');
const { generateStoryText } = require('./stories');

const router = express.Router();

router.get('/story', (req, res) => {
  // get query parameter q. It is url encoded
  const query = req.query.q;
  if (!query) {
    return res.status(400).send('Query parameter q is required');
  }
  const queryDecoded = decodeURIComponent(query);
  // get optional query parameter level
  const level = req.query.level;

  const poemMode = req.query.poemMode === 'true';
  
  // TODO Remove feature flag when paid image generation for entire story is available
  // generateStoryText(queryDecoded, level, poemMode, true).then((storyText) => {
  generateStoryText(queryDecoded, level, poemMode, req.runType === 'free').then((storyText) => {
    res.json(storyText);
  }).catch((error) => {
    console.error(error);
    res.status(500).send('An error occurred while generating the story');
  });
});

module.exports = router;