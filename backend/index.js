require('dotenv').config();
const express = require('express');
const storyEndpoints = require('./story_endpoints');
const dictEndpoints = require('./dict_endpoints');
const fileServer = require('./file-server');
const config = require('./config'); // Import config.js
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());

// Middleware to check if run type is set
app.use(config.checkRunType); // This will prevent access to endpoints until run type is set

// Use the endpoints
app.use('', fileServer);
app.use('/api/v1', storyEndpoints);
app.use('/api/v1', dictEndpoints);

// Prompt user for run type
function promptRunType() {
    console.log('Please enter "f" for free run or "p" for paid run:');
    process.stdin.on('data', (data) => {
        const input = data.toString().trim().toLowerCase();
        if (input === 'f') {
            config.setRunType('free');
            console.log('Run type set to free.');
            startServer();
        } else if (input === 'p') {
            config.setRunType('paid');
            console.log('Run type set to paid.');
            startServer();
        } else {
            console.log('Invalid input. Please enter "f" or "p".');
        }
    });
}

// Start the Express server
function startServer() {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

// Prompt for run type on startup
promptRunType();