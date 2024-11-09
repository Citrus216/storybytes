const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/dict', async (req, res) => {
  const word = req.query.word;
  if (!word) {
    return res.status(400).send('Word query parameter is required');
  }

  try {
    // Send a request to the DictionaryAPI.dev API with the word parameter
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    // Extract data and map it to the simplified structure
    const data = response.data[0]; // Get the first entry

    // Get the first audio link available (if any)
    const audioUrl = data.phonetics.find((phonetic) => phonetic.audio)?.audio || null;

    // Map meanings to only include part of speech and definitions
    const definitions = data.meanings.map((meaning) => ({
      partOfSpeech: meaning.partOfSpeech,
      definition: meaning.definitions[0]?.definition || '',
    }));

    // Create the simplified response
    const simplifiedResponse = {
      word: data.word,
      audio: audioUrl,
      definitions: definitions,
    };

    // Send the simplified response
    res.json(simplifiedResponse);
  } catch (error) {
    // Handle errors from the API request
    if (error.response && error.response.status === 404) {
      res.status(404).send('Word not found');
    } else {
      res.status(500).send('An error occurred while fetching the word definition');
    }
  }
});

module.exports = router;