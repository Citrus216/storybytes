const express = require('express');
const storyEndpoints = require('./story_endpoints');
const dictEndpoints = require('./dict_endpoints');

const app = express();
const port = 8080;

app.use('/api/v1', storyEndpoints);
app.use('/api/v1', dictEndpoints);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});