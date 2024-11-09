require('dotenv').config();
const {createAudioFromText} = require('./audio.js');
const express = require('express');
const storyEndpoints = require('./story_endpoints');
const dictEndpoints = require('./dict_endpoints');

const app = express();
const port = 3000;

app.use('/api/v1', storyEndpoints);
app.use('/api/v1', dictEndpoints);

createAudioFromText('Hello, world!', 'hello.mp3');

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});