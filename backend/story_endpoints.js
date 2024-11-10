const express = require('express');
const { generateStoryText } = require('./stories');
const fs = require('fs');
const path = require('path');

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
  
  generateStoryText(queryDecoded, level, poemMode, req.runType).then((storyText) => {
    res.json(storyText);
  }).catch((error) => {
    console.error(error);
    res.status(500).send('An error occurred while generating the story');
  });
});

router.delete('/story', (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).send('Query parameter id is required');
  }

  const storyPath = path.join(__dirname, 'temp', id);
  fs.rm(storyPath, {recursive: true, force: true}, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while deleting the story');
    }
    res.status(200).send('Story deleted');
  });
});

module.exports = router;